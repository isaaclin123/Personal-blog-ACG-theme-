import ViewAndController.UserManageApp;

import javax.swing.*;

/**
 * App entrance with a main method to create and display the GUI.(Before running this
 * app, please ensure you use group project file in the zip folder as the server,the
 * APIForJavaSwing.js file has been modified. Please run the server before running the app. Please
 * DO NOT clone the group project file from Github and use it as the server.There are also a few
 * users in the database file for testing. The Admin username:Admin, password:abc123456)
 */
public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable(){

            @Override
            public void run() {
                new UserManageApp().createSwingGUI();
            }
        });
    }
}
