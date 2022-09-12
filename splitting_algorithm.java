import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/*
 * Brushing up leaving room function
 * Fixing Concurrent Modification Error
 */
class IDObject {
    int id;
    List<IDObject> connectionList; // Push into the hashmap in Classify Class

    //initiate a user with ID
    public IDObject(int id) { 
        connectionList = new ArrayList<>();
        this.id = id;
    }

    //connect to a specified user
    public void connect(IDObject n, boolean initiator) { 
        connectionList.add(n);
        n.connectionList.add(this);
    }

    //connect to a specified user with specific order in the array for rotational purposes
    public void connect(IDObject n, boolean initiator, int pos) { 
        connectionList.add(pos, n);
        n.connectionList.add(this);
    }

    //disconnect from the most recently connected user
    public void disconnect() {
        connectionList.remove(connectionList.size() - 1).connectionList.remove(this);
    }

    // disconnect function with a specific user
    public void disconnect(IDObject n) {
        connectionList.remove(n);
        n.connectionList.remove(this);
    }

    // connect function with a specific user
    public void connectUpdate(IDObject n) {
        connectionList.add(0, n);
        n.connectionList.add(0, this);
    }
}

class Classify {
    List<IDObject> id; // list if all users
    HashMap<IDObject, List<IDObject>> mapping; // users information
    int count; // total number of users in the room

    public Classify(List<IDObject> id) { //initiate a room with an initial list of users joining in
        this.id = new ArrayList<>(id);
        count = id.size();
        updateOriginal();
        mapping = new HashMap<>();
        for (int i = 0; i < id.size(); i++) {
            mapping.put(id.get(i), id.get(i).connectionList); //put all users and their connections onto the HashMap
        }
    }

    //update functions
    public void update(IDObject n, boolean initiator) {
        id.add(n); //add users to the data

        if (count % 5 == 0) { // when the room is fully connected

            //connect the new user to all users from id 1 through 4
            for (int i = 0; i < 4; i++) {
                id.get(id.size() - 1).connect(id.get(i), initiator);
                mapping.put(id.get(i), id.get(i).connectionList); //update the connected users connections
            }

            mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList); //add the new user into the HashMap
        }

        else if (count % 5 == 1) { // one member in the partial room

            //setup connection for first user in the partial room

            id.get(id.size() - 2).disconnect(); //disconnect with most recently connected user
            id.get(id.size() - 2).connectUpdate(id.get(id.size() - 1)); //connect with newest user in partial room

            //add more temporary users for new users
            id.get(id.size() - 1).connect(id.get(3), initiator); 
            id.get(id.size() - 1).connect(id.get(4), initiator);

            if (count > 10) {
                id.get(id.size() - 1).connect(id.get(5), initiator);
                mapping.put(id.get(5), id.get(5).connectionList);
            } else {
                id.get(id.size() - 1).connect(id.get(0), initiator);
            }

            //update HashMap with users' new connections
            for (int i = 0; i < 5; i++) {
                mapping.put(id.get(i), id.get(i).connectionList);
            }

            mapping.put(id.get(id.size() - 2), id.get(id.size() - 2).connectionList);
            mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);

        }

        else if (count % 5 == 2) { // two members in the partial room
            id.get(id.size() - 3).disconnect();
            id.get(id.size() - 3).connectUpdate(id.get(id.size() - 1));

            id.get(id.size() - 2).disconnect();
            id.get(id.size() - 2).connectUpdate(id.get(id.size() - 1));

            id.get(id.size() - 1).connect(id.get(2), initiator);

            if (count > 10) {
                id.get(id.size() - 1).connect(id.get(5), initiator);
                mapping.put(id.get(5), id.get(5).connectionList);
            } else {
                id.get(id.size() - 1).connect(id.get(0), initiator);
                mapping.put(id.get(0), id.get(0).connectionList);
            }

            mapping.put(id.get(2), id.get(2).connectionList);

            mapping.put(id.get(id.size() - 3), id.get(id.size() - 3).connectionList);
            mapping.put(id.get(id.size() - 2), id.get(id.size() - 2).connectionList);
            mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
        }

        else if (count % 5 == 3) { // three members in the partial room

            for (int i = 4; i >= 2; i--) {
                id.get(id.size() - i).disconnect();
                id.get(id.size() - i).connectUpdate(id.get(id.size() - 1));
                mapping.put(id.get(id.size() - i), id.get(id.size() - i).connectionList);
            }

            id.get(id.size() - 1).connect(id.get(1), initiator);

            mapping.put(id.get(1), id.get(1).connectionList);

            mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
        }

        else if (count % 5 == 4) { // four members in the partial room
            for (int i = 5; i >= 2; i--) {
                id.get(id.size() - i).disconnect();
                id.get(id.size() - i).connectUpdate(id.get(id.size() - 1));
                mapping.put(id.get(id.size() - i), id.get(id.size() - i).connectionList);
            }

            for (int i = 0; i < 4; i++) {
                mapping.put(id.get(i), id.get(i).connectionList);
            }

            mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
        }
        count++; //update the room size
    }

    public void updateOriginal() {
        if (count % 5 == 0) {
            for (int i = 0; i < id.size(); i ++) {
                for (int j = 1; j <= 4 - i%5; j++) {
                    id.get(i).connectUpdate(id.get(i + j));
                }
            }
        }

        else {
            int loop = count / 5;
            for (int i = 0; i < loop * 5; i += 5) {
                for (int j = 1; j <= 4 - i%5; j++) {
                    id.get(i).connectUpdate(id.get(i + j));
                }
            }

            if (count % 5 == 1) {
                for (int i = 0; i <= 3; i++) {
                    id.get(loop * 5).connect(id.get(i), true);
                }
            }

            else if (count % 5 == 2) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));

                id.get(loop * 5).connect(id.get(0), true);
                id.get(loop * 5).connect(id.get(1), true);
                id.get(loop * 5).connect(id.get(2), true);

                id.get(loop * 5 + 1).connect(id.get(3), true);
                id.get(loop * 5 + 1).connect(id.get(4), true);

                if (count > 10) {
                    id.get(loop * 5 + 1).connect(id.get(5), true);
                } else {
                    id.get(loop * 5 + 1).connect(id.get(0), true);
                }

            }

            else if (count % 5 == 3) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 + 2));

                id.get(loop * 5).connect(id.get(0), true);
                id.get(loop * 5).connect(id.get(1), true);

                id.get(loop * 5 + 1).connect(id.get(3), true);
                id.get(loop * 5 + 1).connect(id.get(4), true);

                id.get(loop * 5 + 2).connect(id.get(2), true);
                if (count > 10) 
                    id.get(loop * 5 + 2).connect(id.get(5), true);
                else
                    id.get(loop * 5 + 2).connect(id.get(0), true);
            }

            else if (count % 5 == 4) {
                /*
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 3));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 + 3));
                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5 + 3));*/

                for (int i = 0; i < 3; i++) {
                    for (int j = i + 1; j <=3; j++) {
                        id.get(loop * 5 + i).connectUpdate(id.get(loop * 5 + j));
                    }
                }

                id.get(loop * 5).connect(id.get(0), true);

                id.get(loop * 5 + 1).connect(id.get(3), true);

                id.get(loop * 5 + 2).connect(id.get(2), true);

                id.get(loop * 5 + 3).connect(id.get(1), true);

            }
        }
    }

    public void leave(IDObject n) {
        if (count <= 5) {
            for (int i = n.connectionList.size() - 1; i>=0; i--) {
                IDObject connected = n.connectionList.get(i);
                n.disconnect(connected);
                mapping.put(connected, connected.connectionList);
            }
        } 
        else {
            if (count % 5 == 0) {
                if (id.indexOf(n) >= count - 5) {
                    int[] order = new int[4];
                    order[3] = 0;
                    order[2] = 3;
                    order[1] = 2;
                    order[0] = 1;
                    for (int i = n.connectionList.size(); i >= 0; i--) {
                        n.connectionList.get(i).connect(id.get(order[n.connectionList.size() - i]), true);
                        mapping.put(n.connectionList.get(i), n.connectionList.get(i).connectionList);
                        n.disconnect(n.connectionList.get(i));
                    }
                } 
                else {
                    for (int i  = id.get(id.size() - 1).connectionList.size() - 1; i >= 0; i--) {
                        IDObject connected = id.get(id.size() - 1).connectionList.get(i);
                        connected.disconnect(id.get(id.size() - 1));
                        mapping.put(connected, connected.connectionList);
                    }

                    for (int i  = n.connectionList.size() - 1; i >= 0; i--) {
                        IDObject connected = n.connectionList.get(i);
                        connected.connect(id.get(id.size() - 1), true);
                        mapping.put(connected, connected.connectionList);
                    }

                    mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
                    if (id.indexOf(n) % 5 == 4) {
                        id.add(id.indexOf((n)), id.get(id.size() - 1));
                    } else {
                        id.add(id.indexOf(n) + 4 - id.indexOf(n) % 5, id.get(id.size() - 1));
                    }
                    id.add(id.indexOf((n)), id.get(id.size() - 1));
                    id.remove(id.size() - 1);
                }
            } 
            else if (count % 5 == 1) {
                if (id.indexOf(n) == count - 1) {
                    for (int i = n.connectionList.size() - 1; i >= 0; i--) {
                        IDObject connected = n.connectionList.get(i);
                        n.disconnect(connected);
                        mapping.put(connected, connected.connectionList);
                    }
                } 
                else {
                    for (int i  = id.get(id.size() - 1).connectionList.size() - 1; i >= 0; i--) {
                        IDObject connected = id.get(id.size() - 1).connectionList.get(i);
                        connected.disconnect(id.get(id.size() - 1));
                        mapping.put(connected, connected.connectionList);
                    }

                    for (int i  = n.connectionList.size() - 1; i >= 0; i--) {
                        IDObject connected = n.connectionList.get(i);
                        connected.connect(id.get(id.size() - 1), true);
                        mapping.put(connected, connected.connectionList);
                    }

                    mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
                    if (id.indexOf(n) % 5 == 4) {
                        id.add(id.indexOf((n)), id.get(id.size() - 1));
                    } else {
                        id.add(id.indexOf(n) + 4 - id.indexOf(n) % 5, id.get(id.size() - 1));
                    }
                    id.remove(id.size() - 1);
                }
            } 
            else if (count % 5 == 2) {
                if (id.indexOf(n) >= count - 2) {
                    n.connectionList.get(0).connect(id.get(3), true);
                    n.disconnect(n.connectionList.get(0));
                    for (int i = 0; i < n.connectionList.size(); i++) {
                        n.disconnect(id.get(i));
                        mapping.put(id.get(i), id.get(i).connectionList);
                    }
                } 
                else {
                    for (int i  = id.get(id.size() - 1).connectionList.size() - 1; i >= 0; i--) {
                        IDObject connected = id.get(id.size() - 1).connectionList.get(i);
                        connected.disconnect(id.get(id.size() - 1));
                        mapping.put(connected, connected.connectionList);
                    }

                    id.get(id.size() - 2).connect(id.get(3), true);

                    for (int i = n.connectionList.size() - 1; i >= 0; i--) {
                        IDObject connected = n.connectionList.get(i);
                        n.disconnect(connected);
                        connected.connectUpdate(id.get(id.size() - 1));
                        mapping.put(connected, connected.connectionList);
                    }

                    mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
                    if (id.indexOf(n) % 5 == 4) {
                        id.add(id.indexOf((n)), id.get(id.size() - 1));
                    } else {
                        id.add(id.indexOf(n) + 4 - id.indexOf(n) % 5, id.get(id.size() - 1));
                    }
                    id.remove(id.size() - 1);
                }

            } 
            else if (count % 5 == 3) {
                //reorganization of members order needed - Done
                if (id.indexOf(n) == count - 3) {
                    for (int i = n.connectionList.size() - 1; i>=0; i--) {
                        IDObject connected = n.connectionList.get(i);
                        n.disconnect(connected);
                    }

                    if (count > 10) {
                        id.get(count - 2).connect(id.get(5), true); //4,5,6
                    } else {
                        id.get(count - 2).connect(id.get(0), true); //4,5,1
                    } 

                    id.get(count - 1).disconnect();
                    id.get(count - 1).disconnect();

                    for (int i = 0; i <= 2; i++) {
                        id.get(count - 1).connect(id.get(i), true); //1,2,3
                    }

                    mapping.put(id.get(count - 2), id.get(count - 2).connectionList);
                    mapping.put(id.get(count - 1), id.get(count - 1).connectionList);

                    this.id.add(this.id.remove(count - 2));
                } 
                
                else if (id.indexOf(n) == count - 2) {
                    for (int i = n.connectionList.size() - 1; i>=0; i--) {
                        IDObject connected = n.connectionList.get(i);
                        n.disconnect(connected);
                    }
                    
                    id.get(count - 3).connect(id.get(2), true); //1,2,3

                    id.get(count - 1).disconnect();
                    id.get(count - 1).disconnect();

                    id.get(count - 1).connect(id.get(3), true);
                    id.get(count - 1).connect(id.get(4), true);

                    if (count > 10) {
                        id.get(count - 1).connect(id.get(5), true); //4,5,6
                    } 
                    else {
                        id.get(count - 1).connect(id.get(0), true); //4,5,1
                    }

                    mapping.put(id.get(count - 3), id.get(count - 3).connectionList);
                    mapping.put(id.get(count - 1), id.get(count - 1).connectionList);
                } 

                else if (id.indexOf(n) == count - 1) {
                    for (int i = n.connectionList.size() - 1; i>=0; i--) {
                        IDObject connected = n.connectionList.get(i);
                        n.disconnect(connected);
                    }
                    id.get(count - 3).connect(id.get(2), true);//1,2,3

                    if (count > 10)
                        id.get(count - 2).connect(id.get(5), true); //4,5,6
                    else 
                        id.get(count - 2).connect(id.get(0), true); //4,5,1
                    

                    mapping.put(id.get(count - 2), id.get(count - 2).connectionList);
                    mapping.put(id.get(count - 3), id.get(count - 3).connectionList);
                } 

                else {
                    for (int i  = id.get(id.size() - 1).connectionList.size() - 1; i >= 0; i--) {
                        IDObject connected = id.get(id.size() - 1).connectionList.get(i);
                        connected.disconnect(id.get(id.size() - 1));
                    }

                    id.get(id.size() - 3).connect(id.get(2), true); //1,2,3

                    if (count >= 10)
                        id.get(id.size() - 2).connect(id.get(5), true); //4,5,6
                    else
                        id.get(id.size() - 2).connect(id.get(0), true); //4,5,1

                    

                        for (int i = n.connectionList.size() - 1; i >= 0; i--) {
                            IDObject connected = n.connectionList.get(i);
                            n.disconnect(connected);
                            connected.connectUpdate(id.get(id.size() - 1));
                            mapping.put(connected, connected.connectionList);
                        }

                    mapping.put(id.get(id.size() - 3), id.get(id.size() - 3).connectionList);
                    mapping.put(id.get(id.size() - 2), id.get(id.size() - 2).connectionList);
                    mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);

                    if (id.indexOf(n) % 5 == 4) {
                        id.add(id.indexOf((n)), id.get(id.size() - 1));
                    } 
                    else {
                        id.add(id.indexOf(n) + 4 - id.indexOf(n) % 5, id.get(id.size() - 1));
                    }
                    id.remove(id.size() - 1);
                }
            } 
            else {
                //reorganization of members order needed
                if (id.indexOf(n) == count - 4) {
                    for (int i = n.connectionList.size() - 1; i >=0; i--) {
                        n.disconnect();
                    }

                    id.get(id.size() - 3).connect(id.get(4), true); //4,5

                    if (count >= 10)
                        id.get(id.size() - 2).connect(id.get(5), true, id.get(id.size() - 1).connectionList.size() - 1); //3,6
                    else
                        id.get(id.size() - 2).connect(id.get(0), true, id.get(id.size() - 1).connectionList.size() - 1); //3,1

                    id.get(id.size() - 1).disconnect();

                    id.get(id.size() - 1).connect(id.get(0), true);
                    id.get(id.size() - 1).connect(id.get(1), true); //1,2

                    mapping.put(id.get(id.size() - 3), id.get(id.size() - 3).connectionList);
                    mapping.put(id.get(id.size() - 2), id.get(id.size() - 2).connectionList);
                    mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);

                    id.add(id.size() - 3, id.remove(id.size() - 1));
                } 
                else if (id.indexOf(n) == count - 3) {
                    for (int i = n.connectionList.size() - 1; i >=0; i--) {
                        n.disconnect();
                    }
                    id.get(id.size() - 4).connect(id.get(1), true); //1,2 #1
                    if (count >= 10)
                        id.get(id.size() - 2).connect(id.get(5), true); //3,6 #3
                    else
                        id.get(id.size() - 2).connect(id.get(0), true); //3,1 #3

                    id.get(id.size() - 1).disconnect(); 
                    id.get(id.size() - 1).connect(id.get(3), true); 
                    id.get(id.size() - 1).connect(id.get(4), true); //4,5 #2

                    mapping.put(id.get(id.size() - 4), id.get(id.size() - 4).connectionList);
                    mapping.put(id.get(id.size() - 2), id.get(id.size() - 2).connectionList);
                    mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);

                    id.add(id.size() - 2, id.remove(id.size() - 1));
                } 
                else if (id.indexOf(n) == count - 2) {
                    for (int i = n.connectionList.size() - 1; i >=0; i--) {
                        n.disconnect();
                    }
                    id.get(id.size() - 4).connect(id.get(1), true); //1,2
                    id.get(id.size() - 3).connect(id.get(4), true); //4,5
                    id.get(id.size() - 1).disconnect();
                    id.get(id.size() - 1).connect(id.get(2), true);

                    if (count >= 10)
                        id.get(id.size() - 1).connect(id.get(5), true); //3,6
                    else
                        id.get(id.size() - 1).connect(id.get(0), true); //3,1

                    mapping.put(id.get(id.size() - 4), id.get(id.size() - 4).connectionList);
                    mapping.put(id.get(id.size() - 3), id.get(id.size() - 3).connectionList);
                    mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
                } 
                else if (id.indexOf(n) == count - 1) {
                    for (int i = n.connectionList.size() - 1; i >=0; i--) {
                        n.disconnect();
                    }
                    id.get(id.size() - 4).connect(id.get(1), true);
                    id.get(id.size() - 3).connect(id.get(4), true);
                    if (count >= 10)
                        id.get(id.size() - 2).connect(id.get(5), true); //3,6
                    else
                        id.get(id.size() - 2).connect(id.get(0), true); //3,1

                    mapping.put(id.get(id.size() - 4), id.get(id.size() - 4).connectionList);
                    mapping.put(id.get(id.size() - 3), id.get(id.size() - 3).connectionList);
                    mapping.put(id.get(id.size() - 2), id.get(id.size() - 2).connectionList);
                } 
                else {
                    for (int i = (id.get(id.size() - 1)).connectionList.size() - 1; i >= 0; i--) {
                        id.get(id.size() - 1).disconnect();
                    }

                    id.get(id.size() - 4).connect(id.get(1), true);
                    id.get(id.size() - 3).connect(id.get(4), true);

                    if (count >= 10) 
                        id.get(id.size() - 2).connect(id.get(5), true);
                    else
                        id.get(id.size() - 2).connect(id.get(0), true);

                    int rm_size = n.connectionList.size();
                    for (int i = rm_size - 1; i >=0; i--) {
                        n.connectionList.get(i).connect(id.get(id.size() - 1), true);
                        n.disconnect();
                    }

                    for (int i = 1; i <= 4; i++) {
                        mapping.put(id.get(id.size() - i), id.get(id.size() - i).connectionList);
                    }
                    
                    if (id.indexOf(n) % 5 == 4) {
                        id.add(id.indexOf((n)), id.get(id.size() - 1));
                    } 
                    
                    else {
                        id.add(id.indexOf(n) + 4 - id.indexOf(n) % 5, id.get(id.size() - 1));
                    }

                    id.remove(id.size() - 1);
                }
            }
            this.id.remove(n);
            count--;
        }
    }
}

public class splitting_algorithm {
    public static void main(String[] args) {
        List<IDObject> id = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            id.add(new IDObject(i));
        }
        IDObject a = new IDObject(50);
        IDObject b = new IDObject(51);
        IDObject c = new IDObject(52);
        IDObject d = new IDObject(53);

        Classify cl = new Classify(id);
        cl.update(a, true);
        cl.update(b, true);
        cl.update(c, true);
        cl.update(d, true);

        cl.leave(a);
        //cl.update(new IDObject(54), true);

        cl.leave(b);

        //cl.update(new IDObject(54), true);
        List<IDObject> test = cl.mapping.get(cl.id.get(51));
        for (int i = 0; i < test.size(); i++) {
            int x = test.get(i).id;
            System.out.println(x);
        }
    
    
    }
}
