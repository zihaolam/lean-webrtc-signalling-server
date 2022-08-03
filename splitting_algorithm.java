import java.util.ArrayList;
import java.util.HashMap;


//Draft of UserID Object
class IDObject {
    int id;
    List<IDObject> connectionList; //Push into the hashmap in Classify Class

    public IDObject(int id) {
        connectionList = new ArrayList<>();
        this.id = id;
    }

    public void connect(IDObject n) {
        connectionList.add(n);
    }

    public IDObject disconnect() {
        return connectionList.removeLast();
    }

    public void connectUpdate(IDObject n) {
        connectionList.add(0, n);
    }
}

class Classify {
    List<IDObject> id;
    HashMap<IDObject, List<IDObject>> mapping;
    int count;

    public Classify(List<IDObject> id) {
        id = new ArrayList<>();
        this.id = id;
        count = id.size();
        updateOriginal();
        mapping = new HashMap<>();
        for (int i = 0; i < id.size(); i++)
        {
            mapping.put(id.get(i), id.get(i).connectionList);
        }
    }

    public void update(IDObject n) {
        id.add(n);
        
        if (count % 5 == 0) {
            id.get(id.size() - 1).connect(id.get(0));
            id.get(id.size() - 1).connect(id.get(1));
            id.get(id.size() - 1).connect(id.get(2));
            id.get(id.size() - 1).connect(id.get(3));

            id.get(0).connect(id.get(id.size() - 1));
            id.get(1).connect(id.get(id.size() - 1));
            id.get(2).connect(id.get(id.size() - 1));
            id.get(3).connect(id.get(id.size() - 1));

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
            
            id.get(id.size() - 1).connect(3);
            id.get(id.size() - 1).connect(4);
            
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 2));

            id.get(3).connect(id.get(id.size() - 1));
            id.get(4).connect(id.get(id.size() - 1));

            if (count > 10)
            {
                id.get(id.size() - 1).connect(5);
                id.get(5).connect(id.get(id.size() - 1));
                mapping.put(id.get(5), id.get(5).connectionList);
            }   
            else
            {
                id.get(id.size() - 1).connect(0);
                id.get(0).connect(id.get(id.size() - 1));
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

            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 3));
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 2));

            if (count > 10)
            {
                id.get(5).disconnect();
            }
            else
            {
                id.get(0).disconnect();
            }

            id.get(id.size() - 1).connect(id.get(2));
            id.get(2).connect(id.get(id.size() - 1));

            if (count > 10)
            {
                id.get(id.size() - 1).connect(id.get(5));
                id.get(5).connect(id.get(id.size() - 1));
                mapping.put(id.get(5), id.get(5).connectionList);
            }
            else
            {
                id.get(id.size() - 1).connect(id.get(0));
                id.get(0).connect(id.get(id.size() - 1));
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

            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 2));
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 3));
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 4));
            id.get(id.size() - 1).connect(id.get(1));
            id.get(1).connect(id.get(id.size() - 1));

            
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
            
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 5));
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 4));
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 3));
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 2));
            
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
                if (count % 5 == 0) {
                    id.get(i).connect(id.get(i + 1));
                    id.get(i).connect(id.get(i + 2));
                    id.get(i).connect(id.get(i + 3));
                    id.get(i).connect(id.get(i + 4));
                } else if (count % 5 == 1) {
                    id.get(i).connect(id.get(i - 1));
                    id.get(i).connect(id.get(i + 1));
                    id.get(i).connect(id.get(i + 2));
                    id.get(i).connect(id.get(i + 3));
                } else if (count % 5 == 2) {
                    id.get(i).connect(id.get(i - 2));
                    id.get(i).connect(id.get(i - 1));
                    id.get(i).connect(id.get(i + 1));
                    id.get(i).connect(id.get(i + 2));
                } else if (count % 5 == 3) {
                    id.get(i).connect(id.get(i - 3));
                    id.get(i).connect(id.get(i - 2));
                    id.get(i).connect(id.get(i - 1));
                    id.get(i).connect(id.get(i + 1));
                } else if (count % 5 == 4) {
                    id.get(i).connect(id.get(i - 4));
                    id.get(i).connect(id.get(i - 3));
                    id.get(i).connect(id.get(i - 2));
                    id.get(i).connect(id.get(i - 1));
                }
            }
        } 
        
        else {
            int loop = count / 5;
            for (int i = 0; i < loop * 5; i++) {
                if (count % 5 == 0) {
                    id.get(i).connect(id.get(i + 1));
                    id.get(i).connect(id.get(i + 2));
                    id.get(i).connect(id.get(i + 3));
                    id.get(i).connect(id.get(i + 4));
                } else if (count % 5 == 1) {
                    id.get(i).connect(id.get(i - 1));
                    id.get(i).connect(id.get(i + 1));
                    id.get(i).connect(id.get(i + 2));
                    id.get(i).connect(id.get(i + 3));
                } else if (count % 5 == 2) {
                    id.get(i).connect(id.get(i - 2));
                    id.get(i).connect(id.get(i - 1));
                    id.get(i).connect(id.get(i + 1));
                    id.get(i).connect(id.get(i + 2));
                } else if (count % 5 == 3) {
                    id.get(i).connect(id.get(i - 3));
                    id.get(i).connect(id.get(i - 2));
                    id.get(i).connect(id.get(i - 1));
                    id.get(i).connect(id.get(i + 1));
                } else if (count % 5 == 4) {
                    id.get(i).connect(id.get(i - 4));
                    id.get(i).connect(id.get(i - 3));
                    id.get(i).connect(id.get(i - 2));
                    id.get(i).connect(id.get(i - 1));
                }
            }

            if (count % 5 == 1) {
                id.get(loop * 5).connect(id.get(0));
                id.get(loop * 5).connect(id.get(1));
                id.get(loop * 5).connect(id.get(2));
                id.get(loop * 5).connect(id.get(3));

                id.get(0).connect(id.get(loop * 5));
                id.get(1).connect(id.get(loop * 5));
                id.get(2).connect(id.get(loop * 5));
                id.get(3).connect(id.get(loop * 5));
            } 
            
            else if (count % 5 == 2) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5));

                id.get(loop * 5).connect(id.get(0));
                id.get(loop * 5).connect(id.get(1));
                id.get(loop * 5).connect(id.get(2));

                id.get(0).connect(id.get(loop * 5));
                id.get(1).connect(id.get(loop * 5));
                id.get(2).connect(id.get(loop * 5));


                
                id.get(loop * 5 + 1).connect(id.get(3));
                id.get(loop * 5 + 1).connect(id.get(4));
                id.get(3).connect(id.get(loop * 5 + 1));
                id.get(4).connect(id.get(loop * 5 + 1));
                if (count > 10) {
                    id.get(loop * 5 + 1).connect(id.get(5));
                    id.get(5).connect(id.get(loop * 5 + 1));
                }
                else {
                    id.get(loop * 5 + 1).connect(id.get(0));
                    id.get(0).connect(id.get(loop * 5 + 1));
                }
                
            } 
            
            else if (count % 5 == 3) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5).connect(id.get(0));
                id.get(loop * 5).connect(id.get(1));

                id.get(0).connect(id.get(loop * 5));
                id.get(1).connect(id.get(loop * 5));

                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5 + 1).connect(id.get(2));
                id.get(loop * 5 + 1).connect(id.get(3));

                id.get(2).connect(id.get(loop * 5 + 1));
                id.get(3).connect(id.get(loop * 5 + 1));

                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5));
                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5 + 2).connect(id.get(4));
                if (count > 10) {
                    id.get(loop * 5 + 2).connect(id.get(5));
                    id.get(5).connect(id.get(loop * 5 + 2));
                }
                else {
                    id.get(loop * 5 + 2).connect(id.get(0));
                    id.get(0).connect(id.get(loop * 5 + 2));
                }
            } 
            
            else if (count % 5 == 4) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 3));
                id.get(loop * 5).connect(id.get(0));

                id.get(0).connect(id.get(loop * 5));

                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 + 3));
                id.get(loop * 5 + 1).connect(id.get(1));

                id.get(1).connect(id.get(loop * 5 + 1));

                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5));
                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5 + 3));
                id.get(loop * 5 + 2).connect(id.get(2));

                id.get(2).connect(id.get(loop * 5 + 2));
                
                id.get(loop * 5 + 3).connectUpdate(id.get(loop * 5));
                id.get(loop * 5 + 3).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5 + 3).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5 + 3).connect(id.get(3));

                id.get(3).connect(id.get(loop * 5 + 3));
            }
        }
    }

}
