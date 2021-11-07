package Model;

import java.util.ArrayList;
import java.util.List;

/**
 * A class that contain multiple users information and is used to created a table
 */
public class UserList {

    private List<User> usersList;
    private List<UserListListener> listeners;


    public UserList() {
        this.listeners = new ArrayList<>();
        this.usersList=new ArrayList<>();


    }

    /**
     *Add retrieved users data to the usersList and notify the UserListListener
     */
    public  void add(ArrayList users){
        usersList.addAll(users);

        for (UserListListener u : listeners) {
            u.addedUser(this);
        }

    }

    /**
     *Delete a user form the usersList and notify the UserListListener
     */
    public void delete(int rowIndex){
        User user = usersList.get(rowIndex);
        usersList.remove(user);

        for (UserListListener u :listeners) {
            u.deletedUser(user,this);
        }

    }

    public void addListener(UserListListener listener) {
        listeners.add(listener);
    }

    public int userNumbers() {
        return usersList.size();
    }

    public User getUserAt(int index) {
        return usersList.get(index);
    }

    public int getIndexFor(User user) {
        return usersList.indexOf(user);
    }

    @Override
    public String toString() {
        return "UserList{" +
                "usersList=" + usersList +
                '}';
    }
}

