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
		user.peerUsers.push(this);
	};

	disconnect = () => {
		this.peerUsers[this.peerUsers.length - 1].peerUsers.pop();
		this.peerUsers.pop();
	};

	disconnect_user = (user: UserInterface) => {
		this.peerUsers[this.peerUsers.length - 1].peerUsers.pop();
		this.peerUsers.pop();
	};

	updatePeer = (user: UserInterface) => {
		this.peerUsers.unshift(user);
		user.peerUsers.unshift(this);
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
	
	//currently working on translations
	leave = (user: User) => {
		if (this.count <= 5) {
			for (var i = user.peerUsers.length - 1; i >= 0; i--) {
				var connected = user.peerUsers[i];
				user.disconnect_user(connected);
				this.mapping[connected.id] = connected.peerUsers;
			}
		}
		else {
			
		}
	};

	update = (user: User) => {
		this.peerUsers.push(user);

		const divisor = this.count % 5;

		if (divisor === 0) {

			for (var i = 0; i < 5; i++) {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[i]);
				this.mapping[i] = this.peerUsers[i].peerUsers;
			}

			this.mapping[this.peerUsers.length - 1] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor === 1) {
			this.peerUsers[this.peerUsers.length - 2].disconnect();
			this.peerUsers[this.peerUsers.length - 2].updatePeer(this.peerUsers[this.peerUsers.length - 1]);

			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[3]);
			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[4]);

			if (this.count > 10) {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[5]);
				this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
			} else {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[0]);
			}

			for (var i = 0; i < 5; i++) {
				this.mapping[this.peerUsers[i].id] = this.peerUsers[i].peerUsers;
			}

			this.mapping[this.peerUsers[this.peerUsers.length - 2].id] = this.peerUsers[this.peerUsers.length - 2].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor === 2) {
			this.peerUsers[this.peerUsers.length - 3].disconnect();
			this.peerUsers[this.peerUsers.length - 3].updatePeer(this.peerUsers[this.peerUsers.length - 1]);

			this.peerUsers[this.peerUsers.length - 2].disconnect();
			this.peerUsers[this.peerUsers.length - 2].updatePeer(this.peerUsers[this.peerUsers.length - 1]);

			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[2]);

			if (this.count > 10) {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[5]);
				this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
			} else {
				this.peerUsers[0].connect(this.peerUsers[this.peerUsers.length - 1]);
				this.mapping[this.peerUsers[0].id] = this.peerUsers[0].peerUsers;
			}

			this.mapping[this.peerUsers[2].id] = this.peerUsers[2].peerUsers;


			this.mapping[this.peerUsers[this.peerUsers.length - 3].id] = this.peerUsers[this.peerUsers.length - 3].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 2].id] = this.peerUsers[this.peerUsers.length - 2].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor === 3) {
			for (var i = 4; i >= 2; i--) {
				this.peerUsers[this.peerUsers.length - i].disconnect();
				this.peerUsers[this.peerUsers.length - i].updatePeer(this.peerUsers[this.peerUsers.length - 1]);
				this.mapping[this.peerUsers[this.peerUsers.length - i].id] = this.peerUsers[this.peerUsers.length - i].peerUsers;
			}

			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[1]);

			if (this.count > 10) {
				this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
			}
			
			for (var i = 0; i < 5; i++) {
				this.mapping[this.peerUsers[i].id] = this.peerUsers[i].peerUsers;
			}

			this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor == 4) {
			for (var i = 5; i >= 2; i--) {
				this.peerUsers[this.peerUsers.length - i].disconnect();
				this.peerUsers[this.peerUsers.length - i].updatePeer(this.peerUsers[this.peerUsers.length - 1]);
				this.mapping[this.peerUsers[this.peerUsers.length - i].id] = this.peerUsers[this.peerUsers.length - i].peerUsers;
			}
			
			for (var i = 0; i < 4; i++) {
				this.mapping[this.peerUsers[i].id] = this.peerUsers[i].peerUsers;
			}

			this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		}
		this.count++;
	};

	updateOriginal = () => {
		if (this.count % 5 == 0) {
			for (var i = 0; i < this.peerUsers.length; i++) {
				for (var j = 1; j <= 4 - i%5; j++) {
					this.peerUsers[i].connect(this.peerUsers[i + j]);
				}
			}
		} else {
			const loop = this.count / 5;
			const remainder = this.count % 5;
			for (var i = 0; i < loop * 5; i++) {
				for (var j = 1; j <= 4 - i%5; j++) {
					this.peerUsers[i].connect(this.peerUsers[i + j]);
				}
			}

			if (remainder == 1) {
				for (var i = 0; i <= 3; i++) {
					this.peerUsers[i].connect(this.peerUsers[loop * 5]);
				}

			} else if (remainder == 2) {
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 1]);

				this.peerUsers[loop * 5].connect(this.peerUsers[0]);
				this.peerUsers[loop * 5].connect(this.peerUsers[1]);
				this.peerUsers[loop * 5].connect(this.peerUsers[2]);

				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[3]);
				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[4]);
				
				if (this.count > 10) {
					this.peerUsers[loop * 5 + 1].connect(this.peerUsers[5]);
				} else {
					this.peerUsers[loop * 5 + 1].connect(this.peerUsers[0]);
				}
			} else if (remainder == 3) {
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 1]);
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 2]);
				this.peerUsers[loop * 5 + 1].updatePeer(this.peerUsers[loop * 5 + 2]);


				this.peerUsers[loop * 5].connect(this.peerUsers[0]);
				this.peerUsers[loop * 5].connect(this.peerUsers[1]);

				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[3]);
				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[4]);

				this.peerUsers[loop * 5 + 2].connect(this.peerUsers[2]);

				if (this.count > 10) {
					this.peerUsers[loop * 5 + 2].connect(this.peerUsers[5]);
				} else {
					this.peerUsers[loop * 5 + 2].connect(this.peerUsers[0]);
				}
			} else if (remainder == 4) {

				for (var i = 0; i < 3; i++) {
					for (var j = i + 1; j <= 3; j++) {
						this.peerUsers[loop * 5 + i].updatePeer(this.peerUsers[loop * 5 + j]);
					}
				}

				this.peerUsers[loop * 5].connect(this.peerUsers[0]);

				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[3]);

				this.peerUsers[loop * 5 + 2].connect(this.peerUsers[2]);

				this.peerUsers[loop * 5 + 3].connect(this.peerUsers[1]);

			}
		}
	};
}

export { User, Classify };
