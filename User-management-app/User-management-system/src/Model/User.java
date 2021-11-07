package Model;

/**
 * A class that used to construct a user
 */
public class User {
    private int id,saltRounds,userArticlesCount;
    private String fname,lname,dob,username,description,avatar_image,hashPassword,authToken,isAdmin;

    public User(int id, int saltRounds, int userArticlesCount, String fname, String lname, String dob, String username, String description, String avatar_image, String hashPassword, String authToken, String isAdmin) {
        this.id = id;
        this.saltRounds = saltRounds;
        this.userArticlesCount = userArticlesCount;
        this.fname = fname;
        this.lname = lname;
        this.dob = dob;
        this.username = username;
        this.description = description;
        this.avatar_image = avatar_image;
        this.hashPassword = hashPassword;
        this.authToken = authToken;
        this.isAdmin = isAdmin;
    }

    public User() {
    }

    public int getId() {
        return id;
    }

    public int getSaltRounds() {
        return saltRounds;
    }

    public int getUserArticlesCount() {
        return userArticlesCount;
    }

    public String getFname() {
        return fname;
    }


    public String getLname() {
        return lname;
    }


    public String getDOB() {
        return dob;
    }


    public String getUsername() {
        return username;
    }


    public String getDescription() {
        return description;
    }


    public String getAvatar_image() {
        return avatar_image;
    }


    public String getHashPassword() {
        return hashPassword;
    }


    public String getAuthToken() {
        return authToken;
    }


    public String getIsAdmin() {
        return isAdmin;
    }


    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", saltRounds=" + saltRounds +
                ", userArticlesCount=" + userArticlesCount +
                ", fname='" + fname + '\'' +
                ", lname='" + lname + '\'' +
                ", dob='" + dob + '\'' +
                ", username='" + username + '\'' +
                ", description='" + description + '\'' +
                ", avatar_image='" + avatar_image + '\'' +
                ", hashPassword='" + hashPassword + '\'' +
                ", authToken='" + authToken + '\'' +
                ", isAdmin='" + isAdmin + '\'' +
                '}';
    }
}
