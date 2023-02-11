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

	serialize: () => RoomDetail;
}

export interface RoomDetail {
	users: RoomUser[];
	roomId: string;
	roomName: string;
	roomDescription: string;
	userCount: number;
	background: string;
}

export interface RoomUser {
	socketId: string;
	displayName: string;
	isVideoOn: boolean;
	isEarnMode: boolean;
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
	PAUSE_VIDEO: "pause-video",
	START_VIDEO: "start-video",
	ON_EARN_MODE: "on-earn-mode",
	OFF_EARN_MODE: "off-earn-mode",
	REQUEST_VIDEO: "request-video",
};

export const WebRTCAckStatus = {
	SUCCESS: 200,
	ERROR: 200,
};

export interface RoomDetailsResponse {
	roomDetails: RoomDetail[];
	status: number;
}

export interface JoinRoomAcknowledgement {
	status: number;
	roomDetail: RoomDetail;
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
