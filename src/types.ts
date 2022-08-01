export interface UWebSocket {
	id: string;
	send: (message: string) => void;
	subscribe: (topicId: string) => void;
}

export interface UWebSocketApp {
	publish: (topic: string, message: string) => void;
}

export enum MESSAGE_TYPES {
	OFFER,
	ANSWER,
	NEW_ICE_CANDIDATE,
	NEW_USER,
	JOIN_ROOM,
	LEFT_ROOM,
	ROOM_DETAILS,
	INITIATE_CONNECTION,
	ROOM_USERS,
	PEER_SIGNAL,
}

export interface RoomDetail {
	roomId: string;
	roomName: string;
}

export interface RoomUsers {
	[roomId: string]: string[];
}

export interface SocketUserIdMap {
	[userId: string]: string;
}

export interface JoinRoomMessagePayload {
	sender: string;
	roomId: string;
}

export type RoomUsersMessagePayload = string[];

export type RoomDetailMessagePayload = RoomDetail[];

export interface RTCOfferPayload {
	target: string;
	sender: string;
	sdp: RTCSessionDescriptionInit | RTCSessionDescription | undefined;
}

export interface ICECandidateSignalPayload {
	roomId: string;
	sender: string;
	candidate: RTCIceCandidate;
}

export interface NewUserMessagePayload {
	sender: string;
}

export interface LeaveRoomMessagePayload {
	sender: string;
}

export type WebsocketMessagePayload = NewUserMessagePayload | JoinRoomMessagePayload | ICECandidateSignalPayload | RTCOfferPayload | RoomUsersMessagePayload | RoomDetailMessagePayload;

export interface WebsocketMessage {
	type: MESSAGE_TYPES;
	data: WebsocketMessagePayload;
}

export interface SocketMetadata {
	userId?: string;
	roomId?: string;
}

export interface SocketMap {
	[socketId: string]: {
		ws: any;
		metaData?: SocketMetadata;
	};
}
