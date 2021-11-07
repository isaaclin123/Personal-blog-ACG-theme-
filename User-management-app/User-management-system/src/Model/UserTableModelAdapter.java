package Model;

import javax.swing.table.AbstractTableModel;

/**
 * Adapter class that allows classes JTable and UserList to work together.
 *
 */

public class UserTableModelAdapter extends AbstractTableModel implements UserListListener {
    private static final String[] COLUMN_NAMES = {"ID", "Firstname","Lastname","username","DOB",
            "Description","Avatar_image","HashPassword","saltRounds","authToken","isAdmin","userArticlesCount"};
    private UserList userList;

    public UserTableModelAdapter(UserList userlist) {
        this.userList=userlist;
        this.userList.addListener(this);
    }


    @Override
    public int getRowCount() {
        return userList.userNumbers();
    }

    @Override
    public int getColumnCount() {
        return COLUMN_NAMES.length;
    }

    @Override
    public String getColumnName(int column) {
        return COLUMN_NAMES[column];
    }

    @Override
    public Object getValueAt(int rowIndex, int columnIndex) {
        User user =userList.getUserAt(rowIndex);
        Object result =null;
        switch(columnIndex){
            case 0:
                result =user.getId();
                break;
            case 1:
                result=user.getFname();
                break;
            case 2:
                result=user.getLname();
                break;
            case 3:
                result=user.getUsername();
                break;
            case 4:
                result=user.getDOB();
                break;
            case 5:
                result=user.getDescription();
                break;
            case 6:
                result=user.getAvatar_image();
                break;
            case 7:
                result=user.getHashPassword();
                break;
            case 8:
                result=user.getSaltRounds();
                break;
            case 9:
                result=user.getAuthToken();
                break;
            case 10:
                result=user.getIsAdmin();
                break;
            case 11:
                result=user.getUserArticlesCount();
                break;

        }
        return result;
    }

    /**
     * Sets the table up to display integer or string in different columns.
     */
    @Override
    public Class<?> getColumnClass(int columnIndex) {
        switch(columnIndex){
            case 0:
            case 8:
            case 11:
                return Integer.class;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 9:
            case 10:
                return String.class;
            default:
                throw new IllegalArgumentException();
        }
    }

    /**
     *Fire tableModelEvents so that the JTable view can update the row  used to display the User
     * object that has added or deleted.
     */
    @Override
    public void addedUser(UserList list) {
        fireTableDataChanged();
    }

    @Override
    public void deletedUser(User user, UserList list) {
        int rowIndex =list.getIndexFor(user);
        fireTableRowsDeleted(rowIndex,rowIndex);
    }
}
