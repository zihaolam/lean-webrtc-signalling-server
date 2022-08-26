export interface UserInterface {
	id: string;
	peerUsers: UserInterface[];
	connect: (user: UserInterface) => void;
	disconnect: () => void;
	updatePeer: (user: UserInterface) => void;
}

export type Mapping = Record<string, UserInterface[]>;
