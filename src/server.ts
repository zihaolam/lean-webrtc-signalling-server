import { Server, Socket } from "socket.io";
import { initializeRooms } from "./room";
import { createServer } from "http";
import {
	PrivateMessage,
	eventTypes,
	JoinRoomMessage,
	WebRTCAckStatus,
	JoinRoomAcknowledgement,
	RoomDetailsResponse,
	JoinRoomError,
	FocusPredictionPayload,
} from "./types";
import Express = require("express");
import axios from "axios";

const app = Express();
const httpServer = createServer(app);

const io = new Server(httpServer);

const rooms = initializeRooms();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

const SERVICE_TOKEN = process.env.serviceToken;
app.use(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
	const serviceToken = req.headers["service-token"] as string;
	res.locals.serviceToken = serviceToken;
	if (!serviceToken || serviceToken === SERVICE_TOKEN) return res.status(401).json({ message: "You are not authorized" });
	return next();
});

app.post("/tokens-update", (req: Express.Request, res: Express.Response) => {
	const body = req.body as FocusPredictionPayload;
	const { socketId, prediction } = body;
	const accessToken = req.headers["access-token"];
	var tokenChange = 0;
	if (prediction === 1) tokenChange = 0.1;
	io.to(socketId).emit(eventTypes.TOKEN_UPDATE, { status: WebRTCAckStatus.SUCCESS, data: { tokenChange } });
	if (accessToken)
		axios
			.post(
				"https://o30vbc5f6b.execute-api.ap-southeast-1.amazonaws.com/user/update-token-count",
				{ tokenChange },
				{ headers: { "service-token": res.locals.serviceToken, Authorization: `Bearer ${accessToken}` } }
			)
			.catch((err) => {});
	res.status(200).send("success");
});

io.on("connection", (socket: Socket) => {
	socket.on(
		eventTypes.JOIN_ROOM,
		({ roomId, displayName }: JoinRoomMessage, callback: (response: JoinRoomAcknowledgement | JoinRoomError) => void) => {
			socket.join(roomId);
			socket.data.displayName = displayName;
			socket.data.roomId = roomId;
			try {
				const room = rooms.find(roomId);
				if (!room) return;
				const { subRoom, subRoomIndex } = room?.addUser(socket.id, { socketId: socket.id, displayName, isEarnMode: false, isVideoOn: false });
				socket.data.subRoomIndex = subRoomIndex;
				const serializedRoom = rooms.find(roomId)?.serialize();
				callback({ status: WebRTCAckStatus.SUCCESS, roomDetail: serializedRoom, subRoomUsers: subRoom.get(socket.id) });
				for (const socketId of Array.from(subRoom?.keys())) {
					if (socketId === socket.id) continue;
					socket.to(socketId).emit(eventTypes.USER_UPDATE, {
						status: WebRTCAckStatus.SUCCESS,
						roomDetail: serializedRoom,
						subRoomUsers: subRoom.get(socketId),
					});
				}
			} catch (err) {
				console.log(err);
				callback({ status: WebRTCAckStatus.ERROR, message: "Invalid Room ID" });
			}
		}
	);
	socket.on(eventTypes.WEBRTC_SIGNAL, ({ to, data }: PrivateMessage) =>
		socket.to(to).emit(eventTypes.WEBRTC_SIGNAL, { from: socket.id, data: data })
	);
	socket.on(eventTypes.GET_ROOM_DETAILS, (callback: (response: RoomDetailsResponse) => void) => {
		callback({ status: WebRTCAckStatus.SUCCESS, roomDetails: rooms.serialize() });
	});
	socket.on(eventTypes.LEAVE_ROOM, ({ roomId }: { roomId: string }) => {
		if (socket.data.roomId) {
			const subRoom = rooms.find(roomId)?.deleteUser(socket.id, socket.data.subRoomIndex);
			if (subRoom !== undefined) {
				socket.data.roomId = null;
				socket.data.subRoomIndex = null;
				const roomDetails = rooms.find(roomId)?.serialize();
				for (const socketId of Array.from(subRoom.keys())) {
					if (socketId === socket.id) continue;
					socket.to(socketId).emit(eventTypes.USER_UPDATE, {
						status: WebRTCAckStatus.SUCCESS,
						roomDetail: roomDetails,
						subRoomUsers: subRoom.get(socketId),
					});
				}
			} else {
				console.log("invalid room id or subroom index");
			}
		}
	});
	socket.on("disconnect", () => {
		if (socket.data.roomId) {
			const subRoom = rooms.find(socket.data?.roomId)?.deleteUser(socket.id, socket.data?.subRoomIndex);
			if (!subRoom) return;
			if (subRoom !== undefined) {
				for (const socketId of Array.from(subRoom.keys())) {
					if (socketId === socket.id) continue;
					socket.to(socketId).emit(eventTypes.USER_UPDATE, {
						status: WebRTCAckStatus.SUCCESS,
						roomDetail: rooms.find(socket.data.roomId)?.serialize(),
						subRoomUsers: subRoom.get(socketId),
					});
				}
			} else {
				console.log("invalid room id or subroom index");
			}
		}
	});
	socket.on(eventTypes.PAUSE_VIDEO, () => {
		if (socket.data.roomId) {
			const subRoom = rooms.find(socket.data.roomId).subRooms[socket.data.subRoomIndex];
			if (!subRoom) return;
			const userIndex = subRoom.findIndex((roomUser) => roomUser.socketId === socket.id);
			if (userIndex) subRoom[userIndex].isVideoOn = false;
			subRoom?.forEach((subRoomUser) => {
				if (subRoomUser.socketId === socket.id) return;
				socket.to(subRoomUser.socketId).emit(eventTypes.PAUSE_VIDEO, socket.id);
			});
		}
	});
	socket.on(eventTypes.START_VIDEO, () => {
		if (socket.data.roomId) {
			const subRoom = rooms.find(socket.data.roomId).subRooms[socket.data.subRoomIndex];
			if (!subRoom) return;
			const userIndex = subRoom.findIndex((roomUser) => roomUser.socketId === socket.id);
			if (userIndex) subRoom[userIndex].isVideoOn = true;
			subRoom?.forEach((subRoomUser) => {
				if (subRoomUser.socketId === socket.id) return;
				socket.to(subRoomUser.socketId).emit(eventTypes.START_VIDEO, socket.id);
			});
		}
	});
	socket.on(eventTypes.ON_EARN_MODE, () => {
		if (socket.data.roomId) {
			const subRoom = rooms.find(socket.data.roomId).subRooms[socket.data.subRoomIndex];
			if (!subRoom) return;
			const userIndex = subRoom.findIndex((roomUser) => roomUser.socketId === socket.id);
			if (userIndex) subRoom[userIndex].isEarnMode = true;
			subRoom?.forEach((subRoomUser) => {
				if (subRoomUser.socketId === socket.id) return;
				socket.to(subRoomUser.socketId).emit(eventTypes.ON_EARN_MODE, socket.id);
			});
		}
	});
	socket.on(eventTypes.OFF_EARN_MODE, () => {
		if (socket.data.roomId) {
			const subRoom = rooms.find(socket.data.roomId).subRooms[socket.data.subRoomIndex];
			if (!subRoom) return;
			const userIndex = subRoom.findIndex((roomUser) => roomUser.socketId === socket.id);
			if (userIndex) subRoom[userIndex].isEarnMode = false;
			subRoom?.forEach((subRoomUser) => {
				if (subRoomUser.socketId === socket.id) return;
				socket.to(subRoomUser.socketId).emit(eventTypes.OFF_EARN_MODE, socket.id);
			});
		}
	});

	socket.on(eventTypes.REQUEST_VIDEO, (socketId: string) => {
		socket.to(socketId).emit(eventTypes.REQUEST_VIDEO);
	});
});

httpServer.listen(8888);
