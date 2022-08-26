import { v4 as uuidv4 } from "uuid";
import {
	LeaveRoomMessagePayload,
	MESSAGE_TYPES,
	RoomDetail,
	RoomUsers,
	RTCOfferPayload,
	SocketMap,
	SocketMetadata,
	SocketUserIdMap,
	UWebSocket,
	WebsocketMessage,
	WebsocketMessagePayload,
} from "./types";

class Server {
	sockets: SocketMap = {};
	room_details: RoomDetail[] = [
		{
			roomName: "Public Study Room 1",
			roomId: uuidv4(),
		},
		{
			roomName: "Public Study Room 2",
			roomId: uuidv4(),
		},
		{
			roomName: "Public Study Room 3",
			roomId: uuidv4(),
		},
		{
			roomName: "Public Study Room 4",
			roomId: uuidv4(),
		},
	];
	roomUsers: RoomUsers = Object.fromEntries(this.room_details.map((room) => [room.roomId, []]));

	socketUserIdMap: SocketUserIdMap = {};

	constructor() {}

	sendToSocket = (ws: UWebSocket, message: WebsocketMessage) => ws.send(JSON.stringify(message));
	getSocketWithUserId = (userId: string): UWebSocket => this.sockets[this.socketUserIdMap[userId]].ws;
	getUserMetadataWithSocketId = (socketId: string) => this.sockets[socketId].metaData;
	setUserMetadata = (socketId: string, newMetadata: SocketMetadata) => (this.sockets[socketId].metaData = newMetadata);
	getUserMetadataWithUserId = (userId: string) => this.sockets[this.socketUserIdMap[userId]].metaData;
	addUserIdToSocketMap = (userId: string, socketId: string) => (this.socketUserIdMap[userId] = socketId);
	deleteUserFromRoom = (roomId: string, userId: string) =>
		this.roomUsers[roomId]?.splice(
			this.roomUsers[roomId].findIndex((id) => id === userId),
			1
		);
	buildMessage = (type: MESSAGE_TYPES, data: WebsocketMessagePayload) => JSON.stringify({ type, data });

	joinRoom = (roomId: string, socketId: string, userId: string) => {
		console.log({ before: this.sockets });
		this.setUserMetadata(socketId, { userId, roomId });
		console.log({ after: this.sockets });
		this.addUserIdToSocketMap(userId, socketId);
		this.roomUsers[roomId].push(userId);
	};
}
