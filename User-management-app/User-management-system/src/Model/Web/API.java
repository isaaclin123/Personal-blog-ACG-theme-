package Model.Web;


import Model.SendData;
import Model.User;
import util.JSONUtils;

import java.io.IOException;
import java.net.CookieManager;
import java.net.HttpCookie;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;

/**
 * API class to send request to the server and retrieve data
 */
public class API {
    private static API instance;

    private static final String BASE_URL = "http://localhost:3000/api";

    public static API getInstance() {
        if (instance == null) {
            instance = new API();
        }
        return instance;
    }

    private final CookieManager cookieManager;
    private final HttpClient client;

    public API() {
        this.cookieManager = new CookieManager();

        this.client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .followRedirects(HttpClient.Redirect.NEVER)
                .connectTimeout(Duration.ofSeconds(10))
                .cookieHandler(this.cookieManager)
                .build();
    }

    /**
     *
     * Log out request
     */
    public String logout(String authToken) throws IOException, InterruptedException {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/logout?authToken="+authToken))
                .setHeader("Accept", "application/json")
                .method("GET", HttpRequest.BodyPublishers.noBody());

        HttpRequest request = builder.build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        int statusCode = response.statusCode();
        System.out.println(statusCode);


        return "Log out successfully";
    }

    /**
     *Send password and username in json format to server to login
     */
    public String sendLoginData(SendData data) throws IOException, InterruptedException {

        String json = JSONUtils.toJSON(data);

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/login"))
                .setHeader("Content-Type", "application/json")
                .setHeader("Accept", "application/json")
                .method("POST", HttpRequest.BodyPublishers.ofString(json));

        HttpRequest request = builder.build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseJson = response.body();
        System.out.println(responseJson);
        int statusCode = response.statusCode();
        System.out.println(statusCode);

        if (statusCode==204){
            return "Authentication success";
        }else if(statusCode==401){
            return responseJson;
        }else{
            return null;
        }

    }

    /**
     *
     * Send request to the server to retrieve all users details and convert them to a list if the
     * login user is authenticated
     * as an admin
     */
    public Object getUsers(String authToken) throws IOException, InterruptedException {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/users?authToken="+authToken))
                .setHeader("Accept", "application/json")
                .method("GET", HttpRequest.BodyPublishers.noBody());

        HttpRequest request = builder.build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseJson = response.body();
        int statusCode = response.statusCode();
        System.out.println(statusCode);
        System.out.println(responseJson);

        if(statusCode==401){
            return responseJson;
        }else{
            return JSONUtils.toList(responseJson, User.class);
        }

    }
    /**
     *
     * Send request to the server to delete a user with a requested id if the login user is
     * authenticated as an admin
     */
    public Object deleteUser(String authToken, int id) throws IOException, InterruptedException {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/users/"+id+"?authToken="+authToken))
                .setHeader("Accept", "application/json")
                .method("DELETE", HttpRequest.BodyPublishers.ofString(String.valueOf(id)));

        HttpRequest request = builder.build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseJson = response.body();
        int statusCode = response.statusCode();
        System.out.println(statusCode);
        System.out.println(responseJson);

        if(statusCode==401){
            return responseJson;
        }else if(statusCode==204){
            return statusCode;
        }else{
            return null;
        }

    }

    /**
     *Get the authToken cookie
     */
    public String getAuthToken() {
        List<HttpCookie> cookies = this.cookieManager.getCookieStore().get(URI.create(BASE_URL));
        for (HttpCookie cookie : cookies) {
            if (cookie.getName().equals("authToken")) {
                return cookie.getValue();
            }
        }
        return null;
    }




}
