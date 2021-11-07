package Model;

/**
 * Listener (Observer) interface to be implemented by classes that are
 * interested in changes to the UserList. An instance of a class that
 * implements this interface can be registered with a UserList. Whenever
 * a UserList is changed (e.g. add or delete a user), registered UserListListener objects are
 * notified.
 *
 */

public interface UserListListener {

/**
 * Notifies a UserListListener that users has been added or deleted
 */
     void addedUser(UserList list);
     void deletedUser(User user, UserList list);
}
