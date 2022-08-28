import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;


//Draft of UserID Object
class IDObject {
    int id;
    List<IDObject> connectionList; //Push into the hashmap in Classify Class

    public IDObject(int id) {
        connectionList = new ArrayList<>();
        this.id = id;
    }

    public void connect(IDObject n, boolean initiator) {
        connectionList.add(n);
        n.connectionList.add(this);
    }

    public void disconnect() {
        connectionList.remove(connectionList.size() - 1);
    }

    public void disconnect(IDObject n) {
        connectionList.remove(n);
        n.connectionList.remove(this);
    }

    public void connectUpdate(IDObject n) {
        connectionList.add(0, n);
        n.connectionList.add(0, this);
    }
}

class Classify {
    List<IDObject> id;
    HashMap<IDObject, List<IDObject>> mapping;
    int count;

    public Classify(List<IDObject> id) {
        this.id = new ArrayList<>(id);
        count = id.size();
        updateOriginal();
        mapping = new HashMap<>();
        for (int i = 0; i < id.size(); i++)
        {
            mapping.put(id.get(i), id.get(i).connectionList);
        }
    }

    public void update(IDObject n, boolean initiator) {
        id.add(n);
        
        if (count % 5 == 0) {
            id.get(id.size() - 1).connect(id.get(0), initiator);
            id.get(id.size() - 1).connect(id.get(1), initiator);
            id.get(id.size() - 1).connect(id.get(2), initiator);
            id.get(id.size() - 1).connect(id.get(3), initiator);

            mapping.put(id.get(0), id.get(0).connectionList);
            mapping.put(id.get(1), id.get(1).connectionList);
            mapping.put(id.get(2), id.get(2).connectionList);
            mapping.put(id.get(3), id.get(3).connectionList);
            mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
        }

        else if (count % 5 == 1) {
            id.get(id.size() - 2).disconnect();
            id.get(3).disconnect();
            id.get(id.size() - 2).connectUpdate(id.get(id.size() - 1));
            
            id.get(id.size() - 1).connect(id.get(3), initiator);
            id.get(id.size() - 1).connect(id.get(4), initiator);

            if (count > 10)
            {
                id.get(id.size() - 1).connect(id.get(5), initiator);
                mapping.put(id.get(5), id.get(5).connectionList);
            }   
            else
            {
                id.get(id.size() - 1).connect(id.get(0), initiator);
            }         

            mapping.put(id.get(0), id.get(0).connectionList);
            mapping.put(id.get(1), id.get(1).connectionList);
            mapping.put(id.get(2), id.get(2).connectionList);
            mapping.put(id.get(3), id.get(3).connectionList);
            mapping.put(id.get(4), id.get(4).connectionList);
            mapping.put(id.get(id.size() - 2), id.get(id.size() - 2).connectionList);
            mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
        
        } 

        else if (count % 5 == 2) {
            id.get(id.size() - 3).disconnect();
            id.get(2).disconnect();
            id.get(id.size() - 3).connectUpdate(id.get(id.size() - 1));
            
            id.get(id.size() - 2).disconnect();
            id.get(id.size() - 2).connectUpdate(id.get(id.size() - 1));


            if (count > 10)
            {
                id.get(5).disconnect();
            }
            else
            {
               id.get(0).disconnect(); 
            }

            id.get(2).connect(id.get(id.size() - 1), initiator);

            if (count > 10)
            {
                id.get(id.size() - 1).connect(id.get(5), initiator);
                mapping.put(id.get(5), id.get(5).connectionList);
            }
            else
            {
                id.get(id.size() - 1).connect(id.get(0), initiator);
                mapping.put(id.get(0), id.get(0).connectionList);
            }
            

            mapping.put(id.get(2), id.get(2).connectionList);
            mapping.put(id.get(id.size() - 3), id.get(id.size() - 3).connectionList);
            mapping.put(id.get(id.size() - 2), id.get(id.size() - 2).connectionList);
            mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
        } 

        else if (count % 5 == 3) {
            id.get(id.size() - 4).disconnect();
            id.get(1).disconnect();
            id.get(id.size() - 4).connectUpdate(id.get(id.size() - 1));

            id.get(id.size() - 3).disconnect();
            id.get(4).disconnect();
            id.get(id.size() - 3).connectUpdate(id.get(id.size() - 1));

            id.get(id.size() - 2).disconnect();
            if (count > 10)
            {
                id.get(5).disconnect();
                mapping.put(id.get(5), id.get(5).connectionList);
            }
            else
            {
                id.get(0).disconnect();
                mapping.put(id.get(0), id.get(0).connectionList);
            }
            id.get(id.size() - 3).connectUpdate(id.get(id.size() - 1));
            id.get(id.size() - 1).connect(id.get(1), initiator);

            
            mapping.put(id.get(1), id.get(1).connectionList);

            mapping.put(id.get(id.size() - 4), id.get(id.size() - 4).connectionList);
            mapping.put(id.get(id.size() - 3), id.get(id.size() - 3).connectionList);
            mapping.put(id.get(id.size() - 2), id.get(id.size() - 2).connectionList);
            mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
        } 

        else if (count % 5 == 4) {
            id.get(id.size() - 5).disconnect();
            id.get(id.size() - 4).disconnect();
            id.get(id.size() - 3).disconnect();
            id.get(id.size() - 2).disconnect();
            id.get(0).disconnect();
            id.get(1).disconnect();
            id.get(2).disconnect();
            id.get(3).disconnect();

            id.get(id.size() - 5).connectUpdate(id.get(id.size() - 1));
            id.get(id.size() - 4).connectUpdate(id.get(id.size() - 1));
            id.get(id.size() - 3).connectUpdate(id.get(id.size() - 1));
            id.get(id.size() - 2).connectUpdate(id.get(id.size() - 1));     
            
            mapping.put(id.get(0), id.get(0).connectionList);
            mapping.put(id.get(1), id.get(1).connectionList);
            mapping.put(id.get(2), id.get(2).connectionList);
            mapping.put(id.get(3), id.get(3).connectionList);
            
            mapping.put(id.get(id.size() - 5), id.get(id.size() - 5).connectionList);
            mapping.put(id.get(id.size() - 4), id.get(id.size() - 4).connectionList);
            mapping.put(id.get(id.size() - 3), id.get(id.size() - 3).connectionList);
            mapping.put(id.get(id.size() - 2), id.get(id.size() - 2).connectionList);
            mapping.put(id.get(id.size() - 1), id.get(id.size() - 1).connectionList);
        }
        count++;    
    }

    public void updateOriginal() {
        if (count % 5 == 0) {
            for (int i = 0; i < id.size(); i++) {
                if (i % 5 == 0) {
                    id.get(i).connect(id.get(i + 1), true);
                    id.get(i).connect(id.get(i + 2), true);
                    id.get(i).connect(id.get(i + 3), true);
                    id.get(i).connect(id.get(i + 4), true);
                } else if (i % 5 == 1) {
                    id.get(i).connect(id.get(i - 1), true);
                    id.get(i).connect(id.get(i + 1), true);
                    id.get(i).connect(id.get(i + 2), true);
                    id.get(i).connect(id.get(i + 3), true);
                } else if (i % 5 == 2) {
                    id.get(i).connect(id.get(i - 2), true);
                    id.get(i).connect(id.get(i - 1), true);
                    id.get(i).connect(id.get(i + 1), true);
                    id.get(i).connect(id.get(i + 2), true);
                } else if (i % 5 == 3) {
                    id.get(i).connect(id.get(i - 3), true);
                    id.get(i).connect(id.get(i - 2), true);
                    id.get(i).connect(id.get(i - 1), true);
                    id.get(i).connect(id.get(i + 1), true);
                } else if (i % 5 == 4) {
                    id.get(i).connect(id.get(i - 4), true);
                    id.get(i).connect(id.get(i - 3), true);
                    id.get(i).connect(id.get(i - 2), true);
                    id.get(i).connect(id.get(i - 1), true);
                }
            }
        } 
        
        else {
            int loop = count / 5;
            for (int i = 0; i < loop * 5; i++) {
                if (i % 5 == 0) {
                    id.get(i).connect(id.get(i + 1), true);
                    id.get(i).connect(id.get(i + 2), true);
                    id.get(i).connect(id.get(i + 3), true);
                    id.get(i).connect(id.get(i + 4), true);
                } else if (i % 5 == 1) {
                    id.get(i).connect(id.get(i - 1), true);
                    id.get(i).connect(id.get(i + 1), true);
                    id.get(i).connect(id.get(i + 2), true);
                    id.get(i).connect(id.get(i + 3), true);
                } else if (i % 5 == 2) {
                    id.get(i).connect(id.get(i - 2), true);
                    id.get(i).connect(id.get(i - 1), true);
                    id.get(i).connect(id.get(i + 1), true);
                    id.get(i).connect(id.get(i + 2), true);
                } else if (i % 5 == 3) {
                    id.get(i).connect(id.get(i - 3), true);
                    id.get(i).connect(id.get(i - 2), true);
                    id.get(i).connect(id.get(i - 1), true);
                    id.get(i).connect(id.get(i + 1), true);
                } else if (i % 5 == 4) {
                    id.get(i).connect(id.get(i - 4), true);
                    id.get(i).connect(id.get(i - 3), true);
                    id.get(i).connect(id.get(i - 2), true);
                    id.get(i).connect(id.get(i - 1), true);
                }
            }

            if (count % 5 == 1) {
                id.get(loop * 5).connect(id.get(0), true);
                id.get(loop * 5).connect(id.get(1), true);
                id.get(loop * 5).connect(id.get(2), true);
                id.get(loop * 5).connect(id.get(3), true);

                id.get(0).connect(id.get(loop * 5), true);
                id.get(1).connect(id.get(loop * 5), true);
                id.get(2).connect(id.get(loop * 5), true);
                id.get(3).connect(id.get(loop * 5), true);
            } 
            
            else if (count % 5 == 2) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5));

                id.get(loop * 5).connect(id.get(0), true);
                id.get(loop * 5).connect(id.get(1), true);
                id.get(loop * 5).connect(id.get(2), true);

                id.get(0).connect(id.get(loop * 5), true);
                id.get(1).connect(id.get(loop * 5), true);
                id.get(2).connect(id.get(loop * 5), true);


                
                id.get(loop * 5 + 1).connect(id.get(3), true);
                id.get(loop * 5 + 1).connect(id.get(4), true);
                id.get(3).connect(id.get(loop * 5 + 1), true);
                id.get(4).connect(id.get(loop * 5 + 1), true);
                if (count > 10) {
                    id.get(loop * 5 + 1).connect(id.get(5), true);
                    id.get(5).connect(id.get(loop * 5 + 1), true);
                }
                else {
                    id.get(loop * 5 + 1).connect(id.get(0), true);
                    id.get(0).connect(id.get(loop * 5 + 1), true);
                }
                
            } 
            
            else if (count % 5 == 3) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5).connect(id.get(0), true);
                id.get(loop * 5).connect(id.get(1), true);

                id.get(0).connect(id.get(loop * 5), true);
                id.get(1).connect(id.get(loop * 5), true);

                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5 + 1).connect(id.get(2), true);
                id.get(loop * 5 + 1).connect(id.get(3), true);

                id.get(2).connect(id.get(loop * 5 + 1), true);
                id.get(3).connect(id.get(loop * 5 + 1), true);

                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5));
                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5 + 2).connect(id.get(4), true);
                if (count > 10) {
                    id.get(loop * 5 + 2).connect(id.get(5), true);
                    id.get(5).connect(id.get(loop * 5 + 2), true);
                }
                else {
                    id.get(loop * 5 + 2).connect(id.get(0), true);
                    id.get(0).connect(id.get(loop * 5 + 2), true);
                }
            } 
            
            else if (count % 5 == 4) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 3));
                id.get(loop * 5).connect(id.get(0), true);

                id.get(0).connect(id.get(loop * 5), true);

                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 + 3));
                id.get(loop * 5 + 1).connect(id.get(1), true);

                id.get(1).connect(id.get(loop * 5 + 1), true);

                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5));
                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5 + 3));
                id.get(loop * 5 + 2).connect(id.get(2), true);

                id.get(2).connect(id.get(loop * 5 + 2), true);
                
                id.get(loop * 5 + 3).connectUpdate(id.get(loop * 5));
                id.get(loop * 5 + 3).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5 + 3).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5 + 3).connect(id.get(3), true);

                id.get(3).connect(id.get(loop * 5 + 3), true);
            }
        }
    }
    public void leave(IDObject n)
    {
        if (count % 5 == 0)
        {
            if (id.indexOf(n) >= count - 5)
            {
                int i = 0;
                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                    connected.connect(id.get(i), true);
                    i++;
                }
            }
            else
            {
                for (IDObject connected: id.get(id.size() - 1).connectionList)
                {
                    connected.disconnect(id.get(id.size() - 1));
                }

                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                    connected.connect(id.get(id.size() - 1), true);
                }

                id.add(id.indexOf((n)), id.get(id.size() - 1));
                id.remove(id.size() - 1);
            }
        }
        else if (count % 5 == 1)
        {
            if (id.indexOf(n) == count - 1)
            {
                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                }
            }
            else 
            {
                for (IDObject connected: id.get(id.size() - 1).connectionList)
                {
                    connected.disconnect(id.get(id.size() - 1));
                }

                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                    connected.connect(id.get(id.size() - 1), true);
                }

                id.add(id.indexOf((n)), id.get(id.size() - 1));
                id.remove(id.size() - 1);
            }
        }
        else if (count % 5 == 2)
        {
            if (id.indexOf(n) >= count - 2)
            {
                n.connectionList.get(0).connect(id.get(3), true);
                n.disconnect(n.connectionList.get(0));
                for (int i = 0; i < n.connectionList.size(); i++)
                {
                    n.disconnect(id.get(i));
                }
            }
            else
            {
                for (IDObject connected: id.get(id.size() - 1).connectionList)
                {
                    connected.disconnect(id.get(id.size() - 1));
                }

                id.get(id.size() - 2).connect(id.get(3), true);

                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                    connected.connect(id.get(id.size() - 1), true);
                }

                id.add(id.indexOf((n)), id.get(id.size() - 1));
                id.remove(id.size() - 1);
            }
            
        }
        else if (count % 5 == 3)
        {
            if (id.indexOf(n) == count - 3)
            {
                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                }
                id.get(count - 2).connect(id.get(0), true);
                id.get(count - 1).connect(id.get(1), true);
            }
            else if (id.indexOf(n) == count - 2)
            {
                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                }
                id.get(count - 3).connect(id.get(2), true);
                id.get(count - 1).connect(id.get(3), true);
            }
            else if (id.indexOf(n) == count - 1)
            {
                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                }
                id.get(count - 2).connect(id.get(4), true);
                id.get(count - 3).connect(id.get(0), true);
            }
            else
            {
                for (IDObject connected: id.get(id.size() - 1).connectionList)
                {
                    connected.disconnect(id.get(id.size() - 1));
                }

                id.get(id.size() - 3).connectionList = new ArrayList<IDObject>(Arrays.asList(id.get(0), id.get(1), id.get(2), id.get(id.size() - 2)));
                id.get(id.size() - 2).connectionList = new ArrayList<IDObject>(Arrays.asList(id.get(3), id.get(4), id.get(0), id.get(id.size() - 3)));

                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                    connected.connect(id.get(id.size() - 1), true);
                }

                id.add(id.indexOf((n)), id.get(id.size() - 1));
                id.remove(id.size() - 1);
            }
        }
        else 
        {
            if (id.indexOf(n) == count - 4)
            {
                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                }
                id.get(id.size() - 3).connect(id.get(4), true);
                id.get(id.size() - 2).connect(id.get(0), true);
                id.get(id.size() - 1).connect(id.get(0), true);

            }
            else if (id.indexOf(n) == count - 3)
            {
                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                }
                id.get(id.size() - 4).connect(id.get(3), true);
                id.get(id.size() - 3).connect(id.get(4), true);
                id.get(id.size() - 2).connect(id.get(1), true);

            }
            else if (id.indexOf(n) == count - 2)
            {
                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                }
                id.get(id.size() - 4).connect(id.get(2), true);
                id.get(id.size() - 3).connect(id.get(4), true);
                id.get(id.size() - 1).connect(id.get(0), true);
            }
            else if (id.indexOf(n) == count - 1)
            {
                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                }
                id.get(id.size() - 4).connect(id.get(1), true);
                id.get(id.size() - 3).connect(id.get(4), true);
                id.get(id.size() - 2).connect(id.get(0), true);
            }
            else
            {
                for (IDObject connected: id.get(id.size() - 1).connectionList)
                {
                    connected.disconnect(id.get(id.size() - 1));
                }
                id.get(id.size() - 4).connect(id.get(1), true);
                id.get(id.size() - 3).connect(id.get(4), true);
                id.get(id.size() - 2).connect(id.get(0), true);

                for (IDObject connected: n.connectionList)
                {
                    n.disconnect(connected);
                    connected.connect(id.get(id.size() - 1), true);
                }

                id.add(id.indexOf((n)), id.get(id.size() - 1));
                id.remove(id.size() - 1);
            }
        }
        this.id.remove(n);
        count--;
    }
}


public class splitting_algorithm {
    public static void main(String[] args) {
        List<IDObject> id = new ArrayList<>();
        for (int i = 0; i < 51; i++)
        {
            id.add(new IDObject(i));
        }
        Classify cl = new Classify(id);
        //cl.update(new IDObject(50));
        //cl.update(new IDObject(51));
        //cl.update(new IDObject(52));
        //cl.update(new IDObject(53));
        //cl.update(new IDObject(54));
        List<IDObject> test = cl.mapping.get(cl.id.get(1));
        for (int i = 0; i < test.size(); i++)
        {
            int a = test.get(i).id;
            System.out.println(a);
        }
    }
}
