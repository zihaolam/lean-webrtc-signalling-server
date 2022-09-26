import { PeerUser, RoomUser } from "../types";
import { v4 as uuid4 } from "uuid";

export const allocateInitiators = (users: RoomUser[] | undefined): Map<string, PeerUser[]> | undefined => {
	if (users === undefined) return undefined;
	const userInitiatorMap: Map<string, Map<string, boolean>> = new Map(users.map((user) => [user.socketId, new Map([[user.socketId, false]])]));
	const finalMap: Map<string, PeerUser[]> = new Map();

	for (const user of users) {
		userInitiatorMap.set(user.socketId, new Map<string, boolean>());
		finalMap.set(user.socketId, []);
		for (const peerUser of users) {
			if (peerUser.socketId === user.socketId) continue;
			if (userInitiatorMap.get(peerUser.socketId)?.get(user.socketId)) {
				userInitiatorMap.get(user.socketId)?.set(peerUser.socketId, false);
				finalMap.get(user.socketId)?.push({ ...peerUser, initiator: false, peerId: uuid4() });
			} else {
				userInitiatorMap.get(user.socketId)?.set(peerUser.socketId, true);
				finalMap.get(user.socketId)?.push({ ...peerUser, initiator: true, peerId: uuid4() });
			}
		}
	}
	return finalMap;
};
