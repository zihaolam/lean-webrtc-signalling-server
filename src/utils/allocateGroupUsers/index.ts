import { UserInterface, Mapping } from "./types";
import { v4 as uuidv4 } from "uuid";

class User implements UserInterface {
	id: string;
	peerUsers: UserInterface[];

	constructor() {
		this.id = uuidv4();
		this.peerUsers = [];
	}

	connect = (user: UserInterface) => {
		this.peerUsers.push(user);
	};

	disconnect = () => {
		this.peerUsers.pop();
	};

	updatePeer = (user: UserInterface) => {
		this.peerUsers.unshift(user);
	};
}

class Classify {
	peerUsers: UserInterface[] = [];
	count: number;
	mapping: Mapping = {};

	constructor(peerUsers: UserInterface[]) {
		this.peerUsers = peerUsers;
		this.count = peerUsers.length;
		this.updateOriginal();
		for (var i = 0; i < this.peerUsers.length; i++) {
			this.mapping[this.peerUsers[i].id] = this.peerUsers[i].peerUsers;
		}
	}

	update = (user: User) => {
		this.peerUsers.push(user);

		const divisor = this.count % 5;

		if (divisor === 0) {
			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[0]);
			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[1]);
			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[2]);
			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[3]);

			this.peerUsers[0].connect(this.peerUsers[this.peerUsers.length - 1]);
			this.peerUsers[1].connect(this.peerUsers[this.peerUsers.length - 1]);
			this.peerUsers[2].connect(this.peerUsers[this.peerUsers.length - 1]);
			this.peerUsers[3].connect(this.peerUsers[this.peerUsers.length - 1]);

			this.mapping[0] = this.peerUsers[0].peerUsers;
			this.mapping[1] = this.peerUsers[1].peerUsers;
			this.mapping[2] = this.peerUsers[2].peerUsers;
			this.mapping[3] = this.peerUsers[3].peerUsers;
			this.mapping[this.peerUsers.length - 1] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor === 1) {
			this.peerUsers[this.peerUsers.length - 2].disconnect();
			this.peerUsers[3].disconnect();
			this.peerUsers[this.peerUsers.length - 2].updatePeer(this.peerUsers[this.peerUsers.length - 1]);

			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[3]);
			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[4]);

			this.peerUsers[this.peerUsers.length - 1].updatePeer(this.peerUsers[this.peerUsers.length - 2]);

			this.peerUsers[3].connect(this.peerUsers[this.peerUsers.length - 1]);
			this.peerUsers[4].connect(this.peerUsers[this.peerUsers.length - 1]);

			if (this.count > 10) {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[5]);
				this.peerUsers[5].connect(this.peerUsers[this.peerUsers.length - 1]);
				this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
			} else {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[0]);
				this.peerUsers[0].connect(this.peerUsers[this.peerUsers.length - 1]);
			}

			this.mapping[this.peerUsers[0].id] = this.peerUsers[0].peerUsers;
			this.mapping[this.peerUsers[1].id] = this.peerUsers[1].peerUsers;
			this.mapping[this.peerUsers[2].id] = this.peerUsers[2].peerUsers;
			this.mapping[this.peerUsers[3].id] = this.peerUsers[3].peerUsers;
			this.mapping[this.peerUsers[4].id] = this.peerUsers[4].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 2].id] = this.peerUsers[this.peerUsers.length - 2].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor === 2) {
			this.peerUsers[this.peerUsers.length - 3].disconnect();
			this.peerUsers[2].disconnect();
			this.peerUsers[this.peerUsers.length - 3].updatePeer(this.peerUsers[this.peerUsers.length - 1]);

			this.peerUsers[this.peerUsers.length - 2].disconnect();
			this.peerUsers[this.peerUsers.length - 2].updatePeer(this.peerUsers[this.peerUsers.length - 1]);

			this.peerUsers[this.peerUsers.length - 1].updatePeer(this.peerUsers[this.peerUsers.length - 3]);
			this.peerUsers[this.peerUsers.length - 1].updatePeer(this.peerUsers[this.peerUsers.length - 2]);

			if (this.count > 10) {
				this.peerUsers[5].disconnect();
			} else {
				this.peerUsers[0].disconnect();
			}

			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[2]);
			this.peerUsers[2].connect(this.peerUsers[this.peerUsers.length - 1]);

			if (this.count > 10) {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[5]);
				this.peerUsers[5].connect(this.peerUsers[this.peerUsers.length - 1]);
				this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[0]);

				this.peerUsers[0].connect(this.peerUsers[this.peerUsers.length - 1]);
				this.mapping[this.peerUsers[0].id] = this.peerUsers[0].peerUsers;
			}

			this.mapping[this.peerUsers[2].id] = this.peerUsers[2].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 3].id] = this.peerUsers[this.peerUsers.length - 3].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 2].id] = this.peerUsers[this.peerUsers.length - 2].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor === 3) {
			this.peerUsers[this.peerUsers.length - 4].disconnect();
			this.peerUsers[1].disconnect();
			this.peerUsers[this.peerUsers.length - 4].updatePeer(this.peerUsers[this.peerUsers.length - 1]);

			this.peerUsers[this.peerUsers.length - 3].disconnect();
			this.peerUsers[4].disconnect();
			this.peerUsers[this.peerUsers.length - 3].updatePeer(this.peerUsers[this.peerUsers.length - 1]);

			this.peerUsers[this.peerUsers.length - 2].disconnect();
			if (this.count > 10) {
				this.peerUsers[5].disconnect();
				this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
			} else {
				this.peerUsers[0].disconnect();
				this.mapping[this.peerUsers[0].id] = this.peerUsers[0].peerUsers;
			}
			this.peerUsers[this.peerUsers.length - 3].updatePeer(this.peerUsers[this.peerUsers.length - 1]);

			this.peerUsers[this.peerUsers.length - 1].updatePeer(this.peerUsers[this.peerUsers.length - 2]);
			this.peerUsers[this.peerUsers.length - 1].updatePeer(this.peerUsers[this.peerUsers.length - 3]);
			this.peerUsers[this.peerUsers.length - 1].updatePeer(this.peerUsers[this.peerUsers.length - 4]);
			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[1]);
			this.peerUsers[1].connect(this.peerUsers[this.peerUsers.length - 1]);

			this.mapping[this.peerUsers[1].id] = this.peerUsers[1].peerUsers;

			this.mapping[this.peerUsers[this.peerUsers.length - 4].id] = this.peerUsers[this.peerUsers.length - 4].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 3].id] = this.peerUsers[this.peerUsers.length - 3].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 2].id] = this.peerUsers[this.peerUsers.length - 2].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor == 4) {
			this.peerUsers[this.peerUsers.length - 5].disconnect();
			this.peerUsers[this.peerUsers.length - 4].disconnect();
			this.peerUsers[this.peerUsers.length - 3].disconnect();
			this.peerUsers[this.peerUsers.length - 2].disconnect();
			this.peerUsers[0].disconnect();
			this.peerUsers[1].disconnect();
			this.peerUsers[2].disconnect();
			this.peerUsers[3].disconnect();

			this.peerUsers[this.peerUsers.length - 5].updatePeer(this.peerUsers[this.peerUsers.length - 1]);
			this.peerUsers[this.peerUsers.length - 4].updatePeer(this.peerUsers[this.peerUsers.length - 1]);
			this.peerUsers[this.peerUsers.length - 3].updatePeer(this.peerUsers[this.peerUsers.length - 1]);
			this.peerUsers[this.peerUsers.length - 2].updatePeer(this.peerUsers[this.peerUsers.length - 1]);

			this.peerUsers[this.peerUsers.length - 1].updatePeer(this.peerUsers[this.peerUsers.length - 5]);
			this.peerUsers[this.peerUsers.length - 1].updatePeer(this.peerUsers[this.peerUsers.length - 4]);
			this.peerUsers[this.peerUsers.length - 1].updatePeer(this.peerUsers[this.peerUsers.length - 3]);
			this.peerUsers[this.peerUsers.length - 1].updatePeer(this.peerUsers[this.peerUsers.length - 2]);

			this.mapping[this.peerUsers[0].id] = this.peerUsers[0].peerUsers;
			this.mapping[this.peerUsers[1].id] = this.peerUsers[1].peerUsers;
			this.mapping[this.peerUsers[2].id] = this.peerUsers[2].peerUsers;
			this.mapping[this.peerUsers[3].id] = this.peerUsers[3].peerUsers;

			this.mapping[this.peerUsers[this.peerUsers.length - 5].id] = this.peerUsers[this.peerUsers.length - 5].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 4].id] = this.peerUsers[this.peerUsers.length - 4].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 3].id] = this.peerUsers[this.peerUsers.length - 3].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 2].id] = this.peerUsers[this.peerUsers.length - 2].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		}
		this.count++;
	};

	updateOriginal = () => {
		if (this.count % 5 == 0) {
			for (var i = 0; i < this.peerUsers.length; i++) {
				if (this.count % 5 == 0) {
					this.peerUsers[i].connect(this.peerUsers[i + 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 2]);
					this.peerUsers[i].connect(this.peerUsers[i + 3]);
					this.peerUsers[i].connect(this.peerUsers[i + 4]);
				} else if (this.count % 5 == 1) {
					this.peerUsers[i].connect(this.peerUsers[i - 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 2]);
					this.peerUsers[i].connect(this.peerUsers[i + 3]);
				} else if (this.count % 5 == 2) {
					this.peerUsers[i].connect(this.peerUsers[i - 2]);
					this.peerUsers[i].connect(this.peerUsers[i - 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 2]);
				} else if (this.count % 5 == 3) {
					this.peerUsers[i].connect(this.peerUsers[i - 3]);
					this.peerUsers[i].connect(this.peerUsers[i - 2]);
					this.peerUsers[i].connect(this.peerUsers[i - 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 1]);
				} else if (this.count % 5 == 4) {
					this.peerUsers[i].connect(this.peerUsers[i - 4]);
					this.peerUsers[i].connect(this.peerUsers[i - 3]);
					this.peerUsers[i].connect(this.peerUsers[i - 2]);
					this.peerUsers[i].connect(this.peerUsers[i - 1]);
				}
			}
		} else {
			const loop = this.count / 5;
			for (var i = 0; i < loop * 5; i++) {
				if (this.count % 5 == 0) {
					this.peerUsers[i].connect(this.peerUsers[i + 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 2]);
					this.peerUsers[i].connect(this.peerUsers[i + 3]);
					this.peerUsers[i].connect(this.peerUsers[i + 4]);
				} else if (this.count % 5 == 1) {
					this.peerUsers[i].connect(this.peerUsers[i - 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 2]);
					this.peerUsers[i].connect(this.peerUsers[i + 3]);
				} else if (this.count % 5 == 2) {
					this.peerUsers[i].connect(this.peerUsers[i - 2]);
					this.peerUsers[i].connect(this.peerUsers[i - 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 2]);
				} else if (this.count % 5 == 3) {
					this.peerUsers[i].connect(this.peerUsers[i - 3]);
					this.peerUsers[i].connect(this.peerUsers[i - 2]);
					this.peerUsers[i].connect(this.peerUsers[i - 1]);
					this.peerUsers[i].connect(this.peerUsers[i + 1]);
				} else if (this.count % 5 == 4) {
					this.peerUsers[i].connect(this.peerUsers[i - 4]);
					this.peerUsers[i].connect(this.peerUsers[i - 3]);
					this.peerUsers[i].connect(this.peerUsers[i - 2]);
					this.peerUsers[i].connect(this.peerUsers[i - 1]);
				}
			}

			if (this.count % 5 == 1) {
				this.peerUsers[loop * 5].connect(this.peerUsers[0]);
				this.peerUsers[loop * 5].connect(this.peerUsers[1]);
				this.peerUsers[loop * 5].connect(this.peerUsers[2]);
				this.peerUsers[loop * 5].connect(this.peerUsers[3]);

				this.peerUsers[0].connect(this.peerUsers[loop * 5]);
				this.peerUsers[1].connect(this.peerUsers[loop * 5]);
				this.peerUsers[2].connect(this.peerUsers[loop * 5]);
				this.peerUsers[3].connect(this.peerUsers[loop * 5]);
			} else if (this.count % 5 == 2) {
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 1]);
				this.peerUsers[loop * 5 + 1].updatePeer(this.peerUsers[loop * 5]);

				this.peerUsers[loop * 5].connect(this.peerUsers[0]);
				this.peerUsers[loop * 5].connect(this.peerUsers[1]);
				this.peerUsers[loop * 5].connect(this.peerUsers[2]);

				this.peerUsers[0].connect(this.peerUsers[loop * 5]);
				this.peerUsers[1].connect(this.peerUsers[loop * 5]);
				this.peerUsers[2].connect(this.peerUsers[loop * 5]);

				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[3]);
				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[4]);
				this.peerUsers[3].connect(this.peerUsers[loop * 5 + 1]);
				this.peerUsers[4].connect(this.peerUsers[loop * 5 + 1]);
				if (this.count > 10) {
					this.peerUsers[loop * 5 + 1].connect(this.peerUsers[5]);
					this.peerUsers[5].connect(this.peerUsers[loop * 5 + 1]);
				} else {
					this.peerUsers[loop * 5 + 1].connect(this.peerUsers[0]);
					this.peerUsers[0].connect(this.peerUsers[loop * 5 + 1]);
				}
			} else if (this.count % 5 == 3) {
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 1]);
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 2]);
				this.peerUsers[loop * 5].connect(this.peerUsers[0]);
				this.peerUsers[loop * 5].connect(this.peerUsers[1]);

				this.peerUsers[0].connect(this.peerUsers[loop * 5]);
				this.peerUsers[1].connect(this.peerUsers[loop * 5]);

				this.peerUsers[loop * 5 + 1].updatePeer(this.peerUsers[loop * 5]);
				this.peerUsers[loop * 5 + 1].updatePeer(this.peerUsers[loop * 5 + 2]);
				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[2]);
				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[3]);

				this.peerUsers[2].connect(this.peerUsers[loop * 5 + 1]);
				this.peerUsers[3].connect(this.peerUsers[loop * 5 + 1]);

				this.peerUsers[loop * 5 + 2].updatePeer(this.peerUsers[loop * 5]);
				this.peerUsers[loop * 5 + 2].updatePeer(this.peerUsers[loop * 5 + 1]);
				this.peerUsers[loop * 5 + 2].connect(this.peerUsers[4]);
				if (this.count > 10) {
					this.peerUsers[loop * 5 + 2].connect(this.peerUsers[5]);
					this.peerUsers[5].connect(this.peerUsers[loop * 5 + 2]);
				} else {
					this.peerUsers[loop * 5 + 2].connect(this.peerUsers[0]);
					this.peerUsers[0].connect(this.peerUsers[loop * 5 + 2]);
				}
			} else if (this.count % 5 == 4) {
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 1]);
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 2]);
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 3]);
				this.peerUsers[loop * 5].connect(this.peerUsers[0]);

				this.peerUsers[0].connect(this.peerUsers[loop * 5]);

				this.peerUsers[loop * 5 + 1].updatePeer(this.peerUsers[loop * 5]);
				this.peerUsers[loop * 5 + 1].updatePeer(this.peerUsers[loop * 5 + 2]);
				this.peerUsers[loop * 5 + 1].updatePeer(this.peerUsers[loop * 5 + 3]);
				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[1]);

				this.peerUsers[1].connect(this.peerUsers[loop * 5 + 1]);

				this.peerUsers[loop * 5 + 2].updatePeer(this.peerUsers[loop * 5]);
				this.peerUsers[loop * 5 + 2].updatePeer(this.peerUsers[loop * 5 + 1]);
				this.peerUsers[loop * 5 + 2].updatePeer(this.peerUsers[loop * 5 + 3]);
				this.peerUsers[loop * 5 + 2].connect(this.peerUsers[2]);

				this.peerUsers[2].connect(this.peerUsers[loop * 5 + 2]);

				this.peerUsers[loop * 5 + 3].updatePeer(this.peerUsers[loop * 5]);
				this.peerUsers[loop * 5 + 3].updatePeer(this.peerUsers[loop * 5 + 2]);
				this.peerUsers[loop * 5 + 3].updatePeer(this.peerUsers[loop * 5 + 1]);
				this.peerUsers[loop * 5 + 3].connect(this.peerUsers[3]);

				this.peerUsers[3].connect(this.peerUsers[loop * 5 + 3]);
			}
		}
	};
}

export { User, Classify };
