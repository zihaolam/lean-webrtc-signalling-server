import { MESSAGE_TYPES } from "../types";

export const messageHandler = {
	[MESSAGE_TYPES.OFFER]: (message) => {},
	[MESSAGE_TYPES.ANSWER]: (message) => {},
	[MESSAGE_TYPES.NEW_ICE_CANDIDATE]: (message) => {},
	[MESSAGE_TYPES.NEW_USER]: (message) => {},
	[MESSAGE_TYPES.JOIN_ROOM]: (message) => {},
	[MESSAGE_TYPES.LEFT_ROOM]: (message) => {},
	[MESSAGE_TYPES.ROOM_DETAILS]: (message) => {},
	[MESSAGE_TYPES.INITIATE_CONNECTION]: (message) => {},
	[MESSAGE_TYPES.ROOM_USERS]: (message) => {},
};
