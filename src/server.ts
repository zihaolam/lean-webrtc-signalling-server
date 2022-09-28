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
	AuthorizationTokenPayload,
	FocusPredictionPayload,
} from "./types";
import Express = require("express");
import { validateToken } from "./utils/jwt";
import axios from "axios";

const app = Express();
const httpServer = createServer(app);

const io = new Server(httpServer);

const rooms = initializeRooms();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// app.use(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
// 	const bearerToken = req.headers.authorization.replace("Bearer ", "");
// 	if (bearerToken) return res.status(401).json({ message: "You are not authorized" });
// 	try {
// 		const decodedToken = await validateToken(bearerToken);
// 		res.locals.decodedToken = decodedToken;
// 		res.locals.bearerToken = bearerToken;
// 		next();
// 	} catch {
// 		return res.status(403).json({ message: "You are not authorized!" });
// 	}
// });

app.post("/tokens-update", (req: Express.Request, res: Express.Response) => {
	// const decodedToken: AuthorizationTokenPayload = res.locals.decodedToken;
	console.log(req.body);
	const socketId = req.body.socketId;
	const predictedFocus: FocusPredictionPayload = req.body.prediction;
	var tokenChange = 0;
	if (predictedFocus.label === 1) tokenChange = 1;
	io.to(socketId).emit(eventTypes.TOKEN_UPDATE, { status: WebRTCAckStatus.SUCCESS, data: { tokenChange } });
	axios
		.post(
			"https://jd5hwpred3.execute-api.ap-east-1.amazonaws.com/prod/api/update-token",
			{ tokenChange },
			{ headers: { Authorization: `Bearer ${res.locals.bearerToken}` } }
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
				const { subRoom, subRoomIndex } = rooms.find(roomId)?.addUser(socket.id, { socketId: socket.id, displayName });
				console.log(subRoom);
				socket.data.subRoomIndex = subRoomIndex;
				const serializedRoom = rooms.find(roomId)?.serialize();
				callback({ status: WebRTCAckStatus.SUCCESS, roomDetail: serializedRoom, subRoomUsers: subRoom.get(socket.id) });
				for (const socketId of Array.from(subRoom.keys())) {
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
				for (const socketId of Array.from(subRoom.keys())) {
					if (socketId === socket.id) continue;
					socket.to(socketId).emit(eventTypes.USER_UPDATE, {
						status: WebRTCAckStatus.SUCCESS,
						roomDetail: rooms.find(roomId)?.serialize(),
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
});

httpServer.listen(8888);
