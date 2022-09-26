import { v4 as uuid4 } from "uuid";
import { IRoom, PeerUser, RoomUser, SerializedRoom } from "./types";
import { allocateInitiators } from "./utils/allocateInitiators";

export type RoomMap = Map<string, Room>;

class Room implements IRoom {
	users: Map<string, RoomUser> = new Map();
	roomId: string;
	roomName: string;
	roomDescription: string;
	subRooms: Array<RoomUser[]>;

	constructor({ roomId, roomName, roomDescription }: { roomId: string; roomName: string; roomDescription: string }) {
		this.roomId = roomId;
		this.roomName = roomName;
		this.roomDescription = roomDescription;
		this.subRooms = [];
	}

	addUser = (socketId: string, roomUser: RoomUser): { subRoom: Map<string, PeerUser[]>; subRoomIndex: number } => {
		this.users.set(socketId, roomUser);
		if (!this.subRooms.length) {
			this.subRooms.push([roomUser]);
			return { subRoom: allocateInitiators(this.subRooms[0]), subRoomIndex: 0 };
		} else {
			for (var i = 0; i < this.subRooms.length; i++) {
				if (this.subRooms[i].length < 5) {
					this.subRooms[i].push(roomUser);
					return { subRoom: allocateInitiators(this.subRooms[i]), subRoomIndex: i };
				}
			}
			this.subRooms.push([roomUser]);
			return { subRoom: allocateInitiators([roomUser]), subRoomIndex: i + 1 };
		}
	};

	get userCount(): number {
		return this.users.size;
	}

	getUser = (socketId: string): RoomUser => {
		return this.users.get(socketId);
	};

	deleteUser = (socketId: string, subRoomIndex: number): Map<string, PeerUser[]> => {
		if (subRoomIndex > this.subRooms.length - 1) return undefined;
		this.users.delete(socketId);
		this.subRooms[subRoomIndex] = this.subRooms[subRoomIndex]?.filter((roomUser) => roomUser.socketId !== socketId);
		const peerUsers = allocateInitiators(this.subRooms[subRoomIndex]);
		console.log(peerUsers);
		if (peerUsers === undefined) console.log("invalid subroomIndex");
		else return peerUsers;
	};

	get serializedUsers(): RoomUser[] {
		return Array.from(this.users.values());
	}

	serialize = (): SerializedRoom => {
		return {
			roomId: this.roomId,
			roomName: this.roomName,
			roomDescription: this.roomDescription,
			userCount: this.userCount,
			users: this.serializedUsers,
		};
	};
}

const roomDetails = [
	new Room({
		roomName: "Public Study Room 1",
		roomId: uuid4(),
		roomDescription: "Study for exams and get to know others",
	}),
	new Room({
		roomName: "Public Study Room 2",
		roomId: uuid4(),
		roomDescription: "Study for exams and get to know others",
	}),
	new Room({
		roomName: "Public Study Room 3",
		roomId: uuid4(),
		roomDescription: "Study for exams and get to know others",
	}),
	new Room({
		roomName: "Public Study Room 4",
		roomId: uuid4(),
		roomDescription: "Study for exams and get to know others",
	}),
];

class Rooms {
	private rooms: RoomMap;

	constructor(rooms: Room[]) {
		this.rooms = new Map(rooms.map((roomDetail) => [roomDetail.roomId, roomDetail]));
	}

	serialize(): SerializedRoom[] {
		return Array.from(this.rooms.values()).map((room) => room.serialize());
	}

	find = (roomId: string): Room | undefined => {
		return this.rooms.get(roomId);
	};
}

export const initializeRooms = (): Rooms => new Rooms(roomDetails);

export default Rooms;
