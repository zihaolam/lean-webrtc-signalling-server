//Java

class IDObject {
    int id;
    List<IDObject> connect;

    public IDObject(int id) {
        connect = new ArrayList<>();
        this.id = id;
    }

    public void connect(IDObject n) {
        connect.add(n);
    }
    
  
    public IDObject disconnect() {
        return connect.removeLast();
    }
    
    //Use for adding users that will eventually become a permanent part of the user
    public void connectUpdate(IDObject n) {
        connect.add(0, n);
    }
}

class Classify {
    List<IDObject> id;
    int count;

    public Classify(IDObject[] id) {
        id = new ArrayList<>();
        this.id = id;
        count = id.length;
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
        } 

        else if (count % 5 == 1) {
            id.get(id.size() - 2).disconnect();
            id.get(3).disconnect();
            id.get(id.size() - 2).connectUpdate(id.get(id.size() - 1));
            
            id.get(id.size() - 1).connect(3);
            id.get(id.size() - 1).connect(4);
            id.get(id.size() - 1).connect(0);
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 2));

            id.get(3).connect(id.get(id.size() - 1));
            id.get(4).connect(id.get(id.size() - 1));
            id.get(0).connect(id.get(id.size() - 1));

        } 

        else if (count % 5 == 2) {
            id.get(id.size() - 3).disconnect();
            id.get(2).disconnect();
            id.get(id.size() - 3).connectUpdate(id.get(id.size() - 1));
            
            id.get(id.size() - 2).disconnect();
            id.get(0).disconnect();
            id.get(id.size() - 2).connectUpdate(id.get(id.size() - 1));

            id.get(id.size() - 1).connect(id.get(2));
            id.get(id.size() - 1).connect(id.get(0));
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 3));
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 2));

            id.get(2).connect(id.get(id.size() - 1));
            id.get(0).connect(id.get(id.size() - 1));
        } 

        else if (count % 5 == 3) {
            id.get(id.size() - 4).disconnect();
            id.get(1).disconnect();
            id.get(id.size() - 4).connectUpdate(id.get(id.size() - 1));

            id.get(id.size() - 3).disconnect();
            id.get(4).disconnect();
            id.get(id.size() - 3).connectUpdate(id.get(id.size() - 1));

            id.get(id.size() - 2).disconnect();
            id.get(0).disconnect();
            id.get(id.size() - 3).connectUpdate(id.get(id.size() - 1));

            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 2));
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 3));
            id.get(id.size() - 1).connectUpdate(id.get(id.size() - 4));
            id.get(id.size() - 1).connect(id.get(1));
            id.get(1).connect(id.get(id.size() - 1));
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
        }
        count++;    
    }

    //current proofreading
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
            } 
            
            else if (count % 5 == 2) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5).connect(id.get(0));
                id.get(loop * 5).connect(id.get(1));
                id.get(loop * 5).connect(id.get(2));

                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 - 1));
                id.get(loop * 5 + 1).connect(id.get(3));
                id.get(loop * 5 + 1).connect(id.get(4));
                if (count > 10) {
                    id.get(loop * 5 + 1).connect(id.get(5));
                }
                else {
                    id.get(loop * 5 + 1).connect(id.get(0));
                }
                
            } 
            
            else if (count % 5 == 3) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5).connect(id.get(0));
                id.get(loop * 5).connect(id.get(1));

                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 - 1));
                id.get(loop * 5 + 1).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5 + 1).connect(id.get(2));
                id.get(loop * 5 + 1).connect(id.get(3));

                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5 - 2));
                id.get(loop * 5 + 2).connectUpdate(id.get(loop * 5 - 1));
                id.get(loop * 5 + 2).connect(id.get(4));
                if (count > 10) {
                    id.get(loop * 5 + 2).connect(id.get(5));
                }
                else {
                    id.get(loop * 5 + 2).connect(id.get(0));
                }
            } 
            
            else if (count % 5 == 4) {
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 1));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 2));
                id.get(loop * 5).connectUpdate(id.get(loop * 5 + 3));
                id.get(loop * 5).connect(id.get(0));

                id.get(loop * 5 + 1).connect(id.get(loop * 5 - 1));
                id.get(loop * 5 + 1).connect(id.get(loop * 5 + 1));
                id.get(loop * 5 + 1).connect(id.get(loop * 5 + 2));
                id.get(loop * 5 + 1).connect(id.get(1));

                id.get(loop * 5 + 2).connect(id.get(loop * 5 - 2));
                id.get(loop * 5 + 2).connect(id.get(loop * 5 - 1));
                id.get(loop * 5 + 2).connect(id.get(loop * 5 + 1));
                id.get(loop * 5 + 2).connect(id.get(2));
                
                id.get(loop * 5 + 3).connect(id.get(loop * 5 - 3));
                id.get(loop * 5 + 3).connect(id.get(loop * 5 - 2));
                id.get(loop * 5 + 3).connect(id.get(loop * 5 - 1));
                id.get(loop * 5 + 3).connect(id.get(3));
            }
        }
    }

}
