export interface IRoom {
	users: Map<string, RoomUser>;
	roomId: string;
	roomName: string;
	roomDescription: string;
	userCount: number;
	subRooms: Array<RoomUser[]>;

	addUser: (socketId: string, roomUser: RoomUser) => { subRoom: Map<string, PeerUser[]>; subRoomIndex: number };

	getUser: (socketId: string) => RoomUser;

	deleteUser: (socketId: string, subRoomIndex: number) => Map<string, PeerUser[]>;

	serialize: () => SerializedRoom;
}

export interface SerializedRoom {
	users: RoomUser[];
	roomId: string;
	roomName: string;
	roomDescription: string;
	userCount: number;
}

export interface RoomUser {
	socketId: string;
	displayName: string;
}

export interface PrivateMessage {
	to: string;
	data: any;
}

export interface JoinRoomMessage {
	roomId: string;
	displayName: string;
}

export const eventTypes = {
	JOIN_ROOM: "join-room",
	WEBRTC_SIGNAL: "webrtc-signal",
	GET_ROOM_DETAILS: "get-room-details",
	LEAVE_ROOM: "leave-room",
	USER_UPDATE: "user-update",
	TOKEN_UPDATE: "token-update",
};

export const WebRTCAckStatus = {
	SUCCESS: 200,
	ERROR: 200,
};

export interface RoomDetailsResponse {
	roomDetails: SerializedRoom[];
	status: number;
}

export interface JoinRoomAcknowledgement {
	status: number;
	roomDetail: SerializedRoom;
	subRoomUsers: RoomUser[];
}

export interface JoinRoomError {
	status: number;
	message: string;
}

export interface PeerUser extends RoomUser {
	initiator: boolean;
	peerId: string;
}

export interface AuthorizationTokenPayload {
	exp: number;
	socketId: string;
	userId: string;
}

export interface FocusPredictionPayload {
	prediction: number;
	socketId: string;
	accessToken: string;
}
