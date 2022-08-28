const uWS = require("uWebSockets.js");
const { v4: uuidv4 } = require("uuid");
const decoder = new TextDecoder("utf-8");
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


const PORT = 8888;

let SOCKETS: SocketMap = {};
const ROOM_DETAILS: RoomDetail[] = [
	{
		roomName: "Public Study Room 1",
		roomId: uuidv4(),
		//create room1;
	},
	{
		roomName: "Public Study Room 2",
		roomId: uuidv4(),
		//create room2;
	},
	{
		roomName: "Public Study Room 3",
		roomId: uuidv4(),
		//create room3;
	},
	{
		roomName: "Public Study Room 4",
		roomId: uuidv4(),
		//create room4;
	},
];

let ROOM_USERS: RoomUsers = Object.fromEntries(ROOM_DETAILS.map((room) => [room.roomId, []]));
let SOCKET_USER_ID_MAP: SocketUserIdMap = {};

const broadcast = (topic: string, message: WebsocketMessage) => app.publish(topic, JSON.stringify(message));
const sendToSocket = (ws: UWebSocket, message: WebsocketMessage) => ws.send(JSON.stringify(message));
const getSocketWithUserId = (userId: string): UWebSocket => SOCKETS[SOCKET_USER_ID_MAP[userId]].ws;
const getUserMetadataWithSocketId = (socketId: string) => SOCKETS[socketId].metaData;
const setUserMetadata = (socketId: string, newMetadata: SocketMetadata) => (SOCKETS[socketId].metaData = newMetadata);
const getUserMetadataWithUserId = (userId: string) => SOCKETS[SOCKET_USER_ID_MAP[userId]].metaData;
const addUserIdToSocketMap = (userId: string, socketId: string) => (SOCKET_USER_ID_MAP[userId] = socketId);
const deleteUserFromRoom = (roomId: string, userId: string) =>
	ROOM_USERS[roomId]?.splice(
		ROOM_USERS[roomId].findIndex((id) => id === userId),
		1
	);
const buildMessage = (type: MESSAGE_TYPES, data: WebsocketMessagePayload) => ({ type, data });

const joinRoom = (roomId: string, socketId: string, userId: string) => {
	console.log({ before: SOCKETS });
	setUserMetadata(socketId, { userId, roomId }); //current structure of metadata: userId + Room ID, needs to add an array of subgroup of users
	console.log({ after: SOCKETS });
	addUserIdToSocketMap(userId, socketId);
	ROOM_USERS[roomId].push(userId);
};

const app = uWS
	.App()
	.ws("/connect/:id", {
		open: (ws: UWebSocket) => {
			ws.id = uuidv4();
			SOCKETS[ws.id] = { ws };
			sendToSocket(ws, buildMessage(MESSAGE_TYPES.ROOM_DETAILS, ROOM_DETAILS));
		},

		message: (ws: UWebSocket, message: BufferSource, isBinary: boolean) => {
			const clientMsg = JSON.parse(decoder.decode(message));
			const { roomId, sender, target } = clientMsg.data;
			// console.log(clientMsg);

			switch (clientMsg.type) {
				//get users into the room
				case MESSAGE_TYPES.JOIN_ROOM:
					/* 
					Find the size of the room
					Create the array accordingly
					return it
					if (room.size % 5 == 0)
					{
						update socket userid map
					}
					else if (room.size % 5 == 1)
					{
						update socket useridmap
					}
					else if (room.size % 5 == 2)
					{
						update socket useridmap
					}
					else if (room.size % 5 == 3)
					{
						update socket useridmap
					}
					else 
					{
						update socket useridmap
					}
					*/
					joinRoom(roomId, ws.id, sender);
					ws.subscribe(roomId);
					return broadcast(roomId, buildMessage(MESSAGE_TYPES.NEW_USER, { sender }));

				//setup partial mesh rotation
				
				/*
					
				*/
				/*case MESSAGE_TYPES.INITIATE_CONNECTION:
					return broadcast(roomId, buildMessage(MESSAGE_TYPES.ROOM_USERS, ROOM_USERS[roomId]));
				*/
				case MESSAGE_TYPES.OFFER:
					return sendToSocket(getSocketWithUserId(target), buildMessage(MESSAGE_TYPES.OFFER, clientMsg.data as RTCOfferPayload));

				case MESSAGE_TYPES.ANSWER:
					return sendToSocket(getSocketWithUserId(target), clientMsg);

				case MESSAGE_TYPES.NEW_ICE_CANDIDATE:
					return sendToSocket(getSocketWithUserId(target), clientMsg);

				case MESSAGE_TYPES.PEER_SIGNAL:
					return sendToSocket(getSocketWithUserId(target), clientMsg);

				default:
					console.log("Unknown message type.");
			}
		},
		close: (ws: UWebSocket) => {
			const metadata = getUserMetadataWithSocketId(ws.id);
			delete SOCKETS[ws.id];
			if (metadata?.userId) delete SOCKET_USER_ID_MAP[metadata.userId];

			console.log(ROOM_USERS[metadata?.roomId]);
			if (metadata?.roomId) {
				deleteUserFromRoom(metadata.roomId, metadata.userId);
				return broadcast(metadata.roomId, buildMessage(MESSAGE_TYPES.LEFT_ROOM, { sender: metadata.userId } as LeaveRoomMessagePayload));
			}
			return;
		},
	})
	.get("/room-details", (res, req) => {
		res.end(JSON.stringify(ROOM_DETAILS));
	})
	.listen(PORT, (token) => {
		token ? console.log(`Listening on port: ${PORT}`) : console.log(`Failed to listen to port: ${PORT}`);
	});
