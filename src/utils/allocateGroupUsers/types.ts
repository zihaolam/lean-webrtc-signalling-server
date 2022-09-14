export interface UserInterface {
	id: string;
	peerUsers: UserInterface[];
	connect: (user: UserInterface, initiate: boolean) => void;
	disconnect: () => void;
	updatePeer: (user: UserInterface, intiate: boolean) => void;
	disconnect_user: (user: UserInterface) => void;
}

export type Mapping = Record<string, UserInterface[]>;
