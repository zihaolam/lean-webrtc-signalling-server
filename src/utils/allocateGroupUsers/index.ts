import { UserInterface, Mapping } from "./types";
import { v4 as uuidv4 } from "uuid";

class User implements UserInterface {
	id: string;
	peerUsers: UserInterface[];

	constructor() {
		this.id = uuidv4();
		this.peerUsers = [];
	}

	connect = (user: UserInterface, initiate: boolean) => {
		if (initiate) {
			this.peerUsers.push(user);
			user.peerUsers.push(this);
		}
		
	};

	disconnect = () => {
		this.peerUsers[this.peerUsers.length - 1].peerUsers.pop();
		this.peerUsers.pop();
	};

	disconnect_user = (user: UserInterface) => {
		this.peerUsers[this.peerUsers.length - 1].peerUsers.pop();
		this.peerUsers.pop();
	};

	updatePeer = (user: UserInterface, initiate: boolean) => {
		if (initiate) {
			this.peerUsers.unshift(user);
			user.peerUsers.unshift(this);
		}
		
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
	
	/** 
	 * function to allow a specific user to leave the room
	 * take in a user object
	 * Algorithm:
	 * If the users belong to the most recent partial/full group: apply special treatment to reverse rotate within the last group
	 * If not: take the last user in the room and make it become the last user of the group that just lost a member.
	*/
	leave = (user: User) => {
		if (this.count <= 5) { //scenario where there are only one group
			for (var i = user.peerUsers.length - 1; i >= 0; i--) {
				var connected = user.peerUsers[i];
				user.disconnect_user(connected);
				this.mapping[connected.id] = connected.peerUsers;
			}
		}
		else {
			const remainder = this.count % 5;
			if (remainder == 0) { //scenario with all full groups
				if (this.peerUsers.indexOf(user) >= this.count - 5) { //check if the user is in the most recent group
					let order = [0, 3, 2, 1]; //roation order when there is a group of 4 left out
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						connected.connect(this.peerUsers[order[4 - i]], true);
						user.disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					}
				}
				else {//use the most recently connected user to fill in the gap
					for (var i = this.peerUsers[this.peerUsers.length - 1].peerUsers.length - 1; i >= 0; i--) {
						let connected = this.peerUsers[this.peerUsers.length - 1].peerUsers[i];
						this.peerUsers[this.peerUsers.length - 1].disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					}
					//disconnect all connetions of most recent users

					//put the most recently connected user to the end of the newly created partial group
					this.peerUsers.splice(this.peerUsers.indexOf(user) + 4 - this.peerUsers.indexOf(user) % 5 + 1, 0, this.peerUsers[this.count - 1]);

					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						this.peerUsers[this.peerUsers.length - 1].connect(connected, true);
						this.mapping[connected.id] = connected.peerUsers;
					}
					//connect the affected users to most recently added user

					this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers; //update most recent user mapping

					this.peerUsers.splice(this.peerUsers.length - 1, 1); //remove the last user, completing the moving of this user
				}
			}
			else if (remainder == 1) {
				if(this.peerUsers.indexOf(user) == this.count - 1) {
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						user.disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					}
					//disconnect all users from this left out user
				}
				else {
					for (var i = this.peerUsers[this.peerUsers.length - 1].peerUsers.length - 1; i >= 0; i--) {
						let connected = this.peerUsers[this.peerUsers.length - 1].peerUsers[i];
						this.peerUsers[this.peerUsers.length - 1].disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					}
					//remove all connections to the most recently added user and update it accordingly

					this.peerUsers.splice(this.peerUsers.indexOf(user) + 4 - this.peerUsers.indexOf(user) % 5 + 1, 0, this.peerUsers[this.count - 1]);
					//move the last user to the end of the newly created group 

					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						user.disconnect_user(connected);
						connected.updatePeer(this.peerUsers[this.peerUsers.length - 1], true);
						this.mapping[connected.id] = connected.peerUsers;
					}
					//establish connections for the new group 

					//update last user's new mapping
					this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;

					this.peerUsers.splice(this.peerUsers.length - 1, 1);
				}
			}
			else if (remainder == 2) {
				if(this.peerUsers.indexOf(user) == this.count - 1) {
					user.peerUsers[0].connect(this.peerUsers[3], true); //connect second to last user to the needed user for rotation
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						user.disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					}//remove all users from the last user
					this.mapping[this.peerUsers[this.peerUsers.length - 2].id] = this.peerUsers[this.peerUsers.length - 2].peerUsers; //update the second to last user accordingly
				}
				else if (this.peerUsers.indexOf(user) == this.count - 2) {
					for (var i = this.peerUsers[this.peerUsers.length - 1].peerUsers.length - 1; i >= 0; i--) {
						let connected = this.peerUsers[this.peerUsers.length - 1].peerUsers[i];
						this.peerUsers[this.peerUsers.length - 1].disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					} //disconnect the last user from all other users

					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						user.disconnect_user(connected);
						this.peerUsers[this.peerUsers.length - 1].updatePeer(connected, true); //replicate second to last user's connection to the current last user
						this.mapping[connected.id] = connected.peerUsers;
					}

					this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
				}
				else {
					//similar logic to test case above
					for (var i = this.peerUsers[this.peerUsers.length - 1].peerUsers.length - 1; i >= 0; i--) {
						let connected = this.peerUsers[this.peerUsers.length - 1].peerUsers[i];
						this.peerUsers[this.peerUsers.length - 1].disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					}

					this.peerUsers.splice(this.peerUsers.indexOf(user) + 4 - this.peerUsers.indexOf(user) % 5 + 1, 0, this.peerUsers[this.count - 1]);

					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						user.disconnect_user(connected);
						connected.updatePeer(this.peerUsers[this.peerUsers.length - 1], true);
						this.mapping[connected.id] = connected.peerUsers;
					}

					this.peerUsers[this.count - 2].connect(this.peerUsers[3], true); //setup the second to last user for rotational purposes
					this.mapping[this.peerUsers[this.peerUsers.length - 2].id] = this.peerUsers[this.peerUsers.length - 2].peerUsers;
					this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;

					this.peerUsers.splice(this.peerUsers.length - 1, 1);
				}
			}
			else if (remainder == 3) {
				if (this.peerUsers.indexOf(user) == this.count - 3) {
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						user.disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					}
					//disconnect all users from the to-be-removed user
					if (this.count > 10) {
						this.peerUsers[this.count - 2].connect(this.peerUsers[5], true); //4,5,6
						this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
					}
					else {
						this.peerUsers[this.count - 2].connect(this.peerUsers[0], true);//4,5,1
						this.mapping[this.peerUsers[0].id] = this.peerUsers[0].peerUsers;
					}

					//reset the last user to make its connection become third to last's connection
					this.peerUsers[this.count - 1].disconnect();
					this.peerUsers[this.count - 1].disconnect();

					for (var i = 0; i <= 2; i++) {
						this.peerUsers[this.count - 1].connect(this.peerUsers[i], true);
						this.mapping[this.peerUsers[i].id] = this.peerUsers[i].peerUsers;
					}

					this.mapping[this.peerUsers[this.count - 2].id] = this.peerUsers[this.count - 2].peerUsers;
					this.mapping[this.peerUsers[this.count - 1].id] = this.peerUsers[this.count - 1].peerUsers;

					//swap the third to last user and last user.
					let temp = this.peerUsers[this.count - 1];
					this.peerUsers[this.count - 1] = this.peerUsers[this.count - 3];
					this.peerUsers[this.count - 3] = temp;
				}
				else if (this.peerUsers.indexOf(user) == this.count - 2) {
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						user.disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					}//same as above

					this.peerUsers[this.count - 3].connect(this.peerUsers[2], true); //1,2,3
					this.mapping[this.peerUsers[2].id] = this.peerUsers[2].peerUsers;

					//reset the last user to make its connection become third to last's connection
					this.peerUsers[this.count - 1].disconnect();
					this.peerUsers[this.count - 1].disconnect();

					if (this.count > 10) {
						this.peerUsers[this.count - 1].connect(this.peerUsers[5], true); //4,5,6
						this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
					}
					else {
						this.peerUsers[this.count - 1].connect(this.peerUsers[0], true); //4,5,1
						this.mapping[this.peerUsers[0].id] = this.peerUsers[0].peerUsers;
					}

					this.mapping[this.peerUsers[this.count - 3].id] = this.peerUsers[this.count - 3].peerUsers;
					this.mapping[this.peerUsers[this.count - 1].id] = this.peerUsers[this.count - 1].peerUsers;

				}
				else if (this.peerUsers.indexOf(user) == this.count - 1) {
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						user.disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					} //same as above

					this.peerUsers[this.count - 3].connect(this.peerUsers[2], true); //1,2,3
					this.mapping[this.peerUsers[2].id] = this.peerUsers[2].peerUsers;

					if (this.count > 10) {
						this.peerUsers[this.count - 2].connect(this.peerUsers[5], true); //4,5,6
						this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
					}
					else {
						this.peerUsers[this.count - 2].connect(this.peerUsers[0], true); //4,5,1
						this.mapping[this.peerUsers[0].id] = this.peerUsers[0].peerUsers;
					}

					this.mapping[this.peerUsers[this.count - 2].id] = this.peerUsers[this.count - 2].peerUsers;
					this.mapping[this.peerUsers[this.count - 1].id] = this.peerUsers[this.count - 1].peerUsers;

				}
				else {
					//similar logic to the else-case in other remainder's scenarios
					for (var i = this.peerUsers[this.peerUsers.length - 1].peerUsers.length - 1; i >= 0; i--) {
						let connected = this.peerUsers[this.peerUsers.length - 1].peerUsers[i];
						this.peerUsers[this.peerUsers.length - 1].disconnect_user(connected);
						this.mapping[connected.id] = connected.peerUsers;
					}
					

					this.peerUsers.splice(this.peerUsers.indexOf(user) + 4 - this.peerUsers.indexOf(user) % 5 + 1, 0, this.peerUsers[this.count - 1]);

					//alterations to last partial group for rotational purposes
					this.peerUsers[this.count - 3].connect(this.peerUsers[2], true); //1,2,3
					this.mapping[this.peerUsers[2].id] = this.peerUsers[2].peerUsers;

					if (this.count > 10) {
						this.peerUsers[this.count - 2].connect(this.peerUsers[5], true); //4,5,6
						this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
					}
					else {
						this.peerUsers[this.count - 2].connect(this.peerUsers[0], true); //4,5,1
						this.mapping[this.peerUsers[0].id] = this.peerUsers[0].peerUsers;
					}
					
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						user.disconnect_user(connected);
						connected.updatePeer(this.peerUsers[this.peerUsers.length - 1], true);
						this.mapping[connected.id] = connected.peerUsers;
					}
					//use the last user to fill in the place


					this.mapping[this.peerUsers[this.count - 3].id] = this.peerUsers[this.count - 3].peerUsers;
					this.mapping[this.peerUsers[this.count - 2].id] = this.peerUsers[this.count - 2].peerUsers;
					this.mapping[this.peerUsers[this.count - 1].id] = this.peerUsers[this.count - 1].peerUsers;

					this.peerUsers.splice(this.peerUsers.length - 1, 1);
				}
			}
			else {
				if (this.peerUsers.indexOf(user) == this.count - 4) {
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						user.disconnect();
					}//disconnect the to-be-removed user from the group

					/**
					 * Organization for rotational purposes
					 */
					this.peerUsers[this.count - 3].connect(this.peerUsers[4], true); //4,5
					this.mapping[this.peerUsers[4].id] = this.peerUsers[4].peerUsers;

					if (this.count > 10) {
						this.peerUsers[this.count - 2].connect(this.peerUsers[5], true); //3,6
					}
					else {
						this.peerUsers[this.count - 2].connect(this.peerUsers[0], true); //3,1
					}

					this.peerUsers[this.count - 1].disconnect(); //reset last user

					this.peerUsers[this.count - 1].connect(this.peerUsers[0], true);
					this.peerUsers[this.count - 1].connect(this.peerUsers[1], true);


					//update all users accordingly
					this.mapping[this.peerUsers[this.count - 3].id] = this.peerUsers[this.count - 3].peerUsers;
					this.mapping[this.peerUsers[this.count - 2].id] = this.peerUsers[this.count - 2].peerUsers;
					this.mapping[this.peerUsers[this.count - 1].id] = this.peerUsers[this.count - 1].peerUsers;

				}
				else if (this.peerUsers.indexOf(user) == this.count - 3) {
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						user.disconnect();
					} //disconnect the to-be-removed user from the group


					/**
					 * Organization for rotational purposes
					 */
					this.peerUsers[this.count - 4].connect(this.peerUsers[1], true); //1,2

					if (this.count > 10) {
						this.peerUsers[this.count - 2].connect(this.peerUsers[5], true); //3,6
					}
					else {
						this.peerUsers[this.count - 2].connect(this.peerUsers[0], true); //3,1
					}

					this.peerUsers[this.count - 1].disconnect();

					this.peerUsers[this.count - 1].connect(this.peerUsers[3], true);
					this.peerUsers[this.count - 1].connect(this.peerUsers[4], true);
					
					this.mapping[this.peerUsers[this.count - 4].id] = this.peerUsers[this.count - 4].peerUsers;
					this.mapping[this.peerUsers[this.count - 2].id] = this.peerUsers[this.count - 2].peerUsers;
					this.mapping[this.peerUsers[this.count - 1].id] = this.peerUsers[this.count - 1].peerUsers;

					this.peerUsers.splice(this.count - 3, 0, this.peerUsers[this.count - 1]);
					this.peerUsers.splice(this.count - 1, 0);
				}
				else if (this.peerUsers.indexOf(user) == this.count - 2) {
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						user.disconnect();
					} //disconnect the to-be-removed user from the group

					/**
					 * Organization for rotational purposes
					 */
					this.peerUsers[this.count - 4].connect(this.peerUsers[1], true); //1,2
					this.peerUsers[this.count - 3].connect(this.peerUsers[4], true); //4,5

					this.peerUsers[this.count - 1].disconnect();

					this.peerUsers[this.count - 1].connect(this.peerUsers[2], true);

					if (this.count > 10) {
						this.peerUsers[this.count - 1].connect(this.peerUsers[5], true); //3,6
					}
					else {
						this.peerUsers[this.count - 1].connect(this.peerUsers[0], true); //3,1
					}

					this.mapping[this.peerUsers[this.count - 4].id] = this.peerUsers[this.count - 4].peerUsers;
					this.mapping[this.peerUsers[this.count - 2].id] = this.peerUsers[this.count - 3].peerUsers;
					this.mapping[this.peerUsers[this.count - 1].id] = this.peerUsers[this.count - 1].peerUsers;

				}
				else if (this.peerUsers.indexOf(user) == this.count - 1) {
					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						user.disconnect();
					} //disconnect the to-be-removed user from the group

					/**
					 * Organization for rotational purposes
					 */
					this.peerUsers[this.count - 4].connect(this.peerUsers[1], true); //1,2
					this.peerUsers[this.count - 3].connect(this.peerUsers[4], true); //4,5

					if (this.count > 10) {
						this.peerUsers[this.count - 2].connect(this.peerUsers[5], true); //3,6
					}
					else {
						this.peerUsers[this.count - 2].connect(this.peerUsers[0], true); //3,1
					}

					this.mapping[this.peerUsers[this.count - 4].id] = this.peerUsers[this.count - 4].peerUsers;
					this.mapping[this.peerUsers[this.count - 2].id] = this.peerUsers[this.count - 3].peerUsers;
					this.mapping[this.peerUsers[this.count - 1].id] = this.peerUsers[this.count - 2].peerUsers;
				}
				else {
					//similar logic to the above else case
					for (var i = this.peerUsers[this.count - 1].peerUsers.length - 1; i >= 0; i--) {
						this.peerUsers[this.count - 1].disconnect();
					} 

					this.peerUsers.splice(this.peerUsers.indexOf(user) + 4 - this.peerUsers.indexOf(user) % 5 + 1, 0, this.peerUsers[this.count - 1]);

					this.peerUsers[this.count - 4].connect(this.peerUsers[1], true); //1,2
					this.peerUsers[this.count - 3].connect(this.peerUsers[4], true); //4,5

					if (this.count > 10) {
						this.peerUsers[this.count - 2].connect(this.peerUsers[5], true); //3,6
					}
					else {
						this.peerUsers[this.count - 2].connect(this.peerUsers[0], true); //3,1
					}

					for (var i = user.peerUsers.length - 1; i >= 0; i--) {
						let connected = user.peerUsers[i];
						user.disconnect_user(connected);
						connected.updatePeer(this.peerUsers[this.peerUsers.length - 1], true);
						this.mapping[connected.id] = connected.peerUsers;
					}

					for (var i = 1; i <= 4; i++) {
						this.mapping[this.peerUsers[this.count - i].id] = this.peerUsers[this.count - i].peerUsers; 
					}

					this.peerUsers.splice(this.peerUsers.length - 1, 1);
				}
			}

			for (var i = 0; i <= 5; i++) {
				this.mapping[this.peerUsers[i].id] = this.peerUsers[i].peerUsers;
			} //making sure all these users are up-to-date
		}
		//remove a value in hashmap
		delete this.mapping[user.id];
		this.count--;
		this.peerUsers.splice(this.peerUsers.indexOf(user), 1); //remove user for list of users
	};

	update = (user: User, intiate: boolean) => {
		this.peerUsers.push(user);

		const divisor = this.count % 5;

		if (divisor === 0) {

			for (var i = 0; i < 5; i++) {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[i], intiate);
				this.mapping[i] = this.peerUsers[i].peerUsers;
			}

			this.mapping[this.peerUsers.length - 1] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor === 1) {
			this.peerUsers[this.peerUsers.length - 2].disconnect();
			this.peerUsers[this.peerUsers.length - 2].updatePeer(this.peerUsers[this.peerUsers.length - 1], intiate);

			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[3], intiate);
			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[4], intiate);

			if (this.count > 10) {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[5], intiate);
				this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
			} else {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[0], intiate);
			}

			for (var i = 0; i < 5; i++) {
				this.mapping[this.peerUsers[i].id] = this.peerUsers[i].peerUsers;
			}

			this.mapping[this.peerUsers[this.peerUsers.length - 2].id] = this.peerUsers[this.peerUsers.length - 2].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor === 2) {
			this.peerUsers[this.peerUsers.length - 3].disconnect();
			this.peerUsers[this.peerUsers.length - 3].updatePeer(this.peerUsers[this.peerUsers.length - 1], intiate);

			this.peerUsers[this.peerUsers.length - 2].disconnect();
			this.peerUsers[this.peerUsers.length - 2].updatePeer(this.peerUsers[this.peerUsers.length - 1], intiate);

			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[2], intiate);

			if (this.count > 10) {
				this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[5], intiate);
				this.mapping[this.peerUsers[5].id] = this.peerUsers[5].peerUsers;
			} else {
				this.peerUsers[0].connect(this.peerUsers[this.peerUsers.length - 1], intiate);
				this.mapping[this.peerUsers[0].id] = this.peerUsers[0].peerUsers;
			}

			this.mapping[this.peerUsers[2].id] = this.peerUsers[2].peerUsers;


			this.mapping[this.peerUsers[this.peerUsers.length - 3].id] = this.peerUsers[this.peerUsers.length - 3].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 2].id] = this.peerUsers[this.peerUsers.length - 2].peerUsers;
			this.mapping[this.peerUsers[this.peerUsers.length - 1].id] = this.peerUsers[this.peerUsers.length - 1].peerUsers;
		} else if (divisor === 3) {
			for (var i = 4; i >= 2; i--) {
				this.peerUsers[this.peerUsers.length - i].disconnect();
				this.peerUsers[this.peerUsers.length - i].updatePeer(this.peerUsers[this.peerUsers.length - 1], intiate);
				this.mapping[this.peerUsers[this.peerUsers.length - i].id] = this.peerUsers[this.peerUsers.length - i].peerUsers;
			}

			this.peerUsers[this.peerUsers.length - 1].connect(this.peerUsers[1], intiate);

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
				this.peerUsers[this.peerUsers.length - i].updatePeer(this.peerUsers[this.peerUsers.length - 1], intiate);
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
					this.peerUsers[i].connect(this.peerUsers[i + j], true);
				}
			}
		} else {
			const loop = this.count / 5;
			const remainder = this.count % 5;
			for (var i = 0; i < loop * 5; i++) {
				for (var j = 1; j <= 4 - i%5; j++) {
					this.peerUsers[i].connect(this.peerUsers[i + j], true);
				}
			}

			if (remainder == 1) {
				for (var i = 0; i <= 3; i++) {
					this.peerUsers[i].connect(this.peerUsers[loop * 5], true);
				}

			} else if (remainder == 2) {
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 1], true);

				this.peerUsers[loop * 5].connect(this.peerUsers[0], true);
				this.peerUsers[loop * 5].connect(this.peerUsers[1], true);
				this.peerUsers[loop * 5].connect(this.peerUsers[2], true);

				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[3], true);
				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[4], true);
				
				if (this.count > 10) {
					this.peerUsers[loop * 5 + 1].connect(this.peerUsers[5], true);
				} else {
					this.peerUsers[loop * 5 + 1].connect(this.peerUsers[0], true);
				}
			} else if (remainder == 3) {
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 1], true);
				this.peerUsers[loop * 5].updatePeer(this.peerUsers[loop * 5 + 2], true);
				this.peerUsers[loop * 5 + 1].updatePeer(this.peerUsers[loop * 5 + 2], true);


				this.peerUsers[loop * 5].connect(this.peerUsers[0], true);
				this.peerUsers[loop * 5].connect(this.peerUsers[1], true);

				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[3], true);
				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[4], true);

				this.peerUsers[loop * 5 + 2].connect(this.peerUsers[2], true);

				if (this.count > 10) {
					this.peerUsers[loop * 5 + 2].connect(this.peerUsers[5], true);
				} else {
					this.peerUsers[loop * 5 + 2].connect(this.peerUsers[0], true);
				}
			} else if (remainder == 4) {

				for (var i = 0; i < 3; i++) {
					for (var j = i + 1; j <= 3; j++) {
						this.peerUsers[loop * 5 + i].updatePeer(this.peerUsers[loop * 5 + j], true);
					}
				}

				this.peerUsers[loop * 5].connect(this.peerUsers[0], true);

				this.peerUsers[loop * 5 + 1].connect(this.peerUsers[3], true);

				this.peerUsers[loop * 5 + 2].connect(this.peerUsers[2], true);

				this.peerUsers[loop * 5 + 3].connect(this.peerUsers[1], true);

			}
		}
	};
}

export { User, Classify };
