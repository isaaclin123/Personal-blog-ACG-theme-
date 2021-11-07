package ViewAndController;

import Model.Web.API;
import Model.SendData;
import Model.User;
import Model.UserList;
import Model.UserTableModelAdapter;

import javax.swing.*;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Application program that allow an admin to login and delete users.
 * If the user is authenticated as an admin, then a list of users will be
 * obtained from the backend and displayed in the JTable.When the user selects a row in the
 * JTable then clicks the “delete user” button, the selected user will be deleted from the
 * backend and the JTable will be updated accordingly.However, the Admin can not delete itself
 * from the JTable.
 * If the user was not authenticated, or was authenticated but not as an admin, instead an
 * appropriate error message will be displayed in a dialog box, and the app will be terminated
 *
 */

public class UserManageApp extends JPanel {
    private  JButton loginBtn;
    private  JButton logoutBtn;
    private  JButton deleteBtn;
    private  JTextField username;
    private  JPasswordField password;
    private  JTable userTable;
    private String authToken;
    private SendData data;
    private JScrollPane tableView;

    private UserList userList;

    private class Worker extends SwingWorker<Object,Object>{
        /**
         * Swing worker inner class to do the login request and retrieve data request in the background
         */
        @Override
        protected Object doInBackground() throws IOException, InterruptedException {
            String s = API.getInstance().sendLoginData(data);
            System.out.println(s);
            if(!isCancelled()){
                publish(s);
            }

            authToken = API.getInstance().getAuthToken();
            System.out.println(authToken);
            Object users = null;
            if(authToken!=null) {
                users = API.getInstance().getUsers(authToken);
            }
            return users;
        }

        /**
         *Immediate result to notify the user if the username and password are authenticated. If
         * authentication fail, the app will be terminated.
         */
        @Override
        protected void process(List<Object> chunks) {
            int i;
            for (i = 0; i < chunks.size(); i++) {
                JOptionPane.showMessageDialog(null,chunks.get(i));
            }
            if(chunks.get(0).equals("Authentication success")) {
                logoutBtn.setEnabled(true);
                loginBtn.setEnabled(false);
            }else{
                logoutBtn.setEnabled(false);
                loginBtn.setEnabled(true);
                System.exit(0);
            }

        }

        /**
         * Retrieve the users data and display the JTable once the background work is finished if
         * the user is admin, otherwise the app will be terminated
         */
        @Override
        protected void done() {
            try {
                Object o = get();
                if (o instanceof List){
                    tableView.setVisible(true);
                    ArrayList users = (ArrayList<User>)o;
                    userList =new UserList();
                    userList.add(users);
                    UserTableModelAdapter userTableModelAdapter = new UserTableModelAdapter(userList);
                    userTable.setModel(userTableModelAdapter);
                    userList.addListener(userTableModelAdapter);
                }else{
                    JOptionPane.showMessageDialog(null,"You are not an admin");
                    API.getInstance().logout(authToken);
                    System.exit(0);
                }
            } catch (InterruptedException | ExecutionException | IOException e) {
                e.printStackTrace();
            }
        }
    }
    /**
     * Constructor method to initialise the application.
     */
    public UserManageApp(){
        /*
          Separate the login and logout and delete features to a panel and the JTable to another
          scroll panel.
         */
        JPanel userAccount = new JPanel(new FlowLayout(FlowLayout.CENTER));
        userAccount.setPreferredSize(new Dimension(600,150));
        loginBtn = new JButton("login");
        logoutBtn = new JButton("logout");
        deleteBtn = new JButton("delete user");
        username = new JTextField(20);

        password = new JPasswordField(20);
        JLabel usernameLabel = new JLabel("Username:");
        JLabel passwordLabel = new JLabel("Password:");
        setBackground(Color.WHITE);

        setPreferredSize(new Dimension(600,600));
        userAccount.add(usernameLabel);
        userAccount.add(username);
        userAccount.add(passwordLabel);
        userAccount.add(password);
        userAccount.add(loginBtn);
        userAccount.add(logoutBtn);
        logoutBtn.setEnabled(false);
        userAccount.add(deleteBtn);
        deleteBtn.setEnabled(false);
        this.add(userAccount);
        tableView = new JScrollPane();
        tableView.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
        tableView.setPreferredSize(new Dimension(600,450));
        userTable = new JTable();
        tableView.setViewportView(userTable);
        this.add(tableView);
        /*
        Enable the delete button when a row is selected
         */
        userTable.getSelectionModel().addListSelectionListener(new ListSelectionListener() {
            @Override
            public void valueChanged(ListSelectionEvent e) {

                deleteBtn.setEnabled(!e.getValueIsAdjusting() && userTable.getSelectedRow() != -1);
            }
        });
        /*
        Retrieve the username and password that a user entered execute the swing worker
         */
        loginBtn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String usernameText = username.getText().trim();
                String passwordText = String.valueOf(password.getPassword());
                data = new SendData(usernameText, passwordText);
                Worker worker = new Worker();
                worker.execute();
            }
        });

        /*
        When the logout button is clicked, deleted the authToken from the backend and exit the app
         */
        logoutBtn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    String logout = API.getInstance().logout(authToken);
                    JOptionPane.showMessageDialog(null,logout);
                } catch (IOException | InterruptedException ioException) {
                    ioException.printStackTrace();
                }
                username.setText("");
                password.setText("");
                loginBtn.setEnabled(true);
                tableView.setVisible(false);
                deleteBtn.setEnabled(false);
                logoutBtn.setEnabled(false);
                authToken=null;
                System.exit(0);

            }
        });
        /*
        When the delete button is clicked, if the selected row is not the admin, the user will be
         deleted from the backend the table will be updated accordingly. If the selected row is
         the admin, a message will be displayed telling the user the admin can not be deleted.
         */
        deleteBtn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int selectedRow = userTable.getSelectedRow();
                Integer id =(Integer)userTable.getModel().getValueAt(selectedRow,0);
                System.out.println(id);
                if(id==5){
                    JOptionPane.showMessageDialog(null,"You can not delete the ADMIN.");
                }else{
                    try {
                        API.getInstance().deleteUser(authToken,id);
                        userList.delete(selectedRow);
                        System.out.println(userList.userNumbers());
                        JOptionPane.showMessageDialog(null,"Deleted user (user id: "+id+" ) " +
                                "successfully");
                    } catch (IOException | InterruptedException ioException) {
                        ioException.printStackTrace();
                    }

                }

                }

        });




    }
    public void createSwingGUI(){
        // Create and set up the window.
        JFrame frame = new JFrame("User Management System");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Create and set up the content pane.
        JComponent newContentPane = new UserManageApp();
        frame.add(newContentPane);

        // Display the window.
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
}
