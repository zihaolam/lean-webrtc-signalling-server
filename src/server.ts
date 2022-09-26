import { Server, Socket } from "socket.io";
import { initializeRooms } from "./room";
import { createServer } from "http";
import {
	PrivateMessage,
	eventTypes,
	JoinRoomMessage,
	WebRTCAckStatus,
	JoinRoomAcknowledgement,
	IRoom,
	RoomDetailsResponse,
	JoinRoomError,
	PeerUser,
} from "./types";

const httpServer = createServer();

const io = new Server(httpServer);

const rooms = initializeRooms();

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
