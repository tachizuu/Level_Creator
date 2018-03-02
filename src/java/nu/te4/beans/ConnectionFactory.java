package nu.te4.beans;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionFactory
{
    public static Connection getConnection() throws SQLException, ClassNotFoundException
    {
        String url = "jdbc:mysql://localhost/DoD_Highscores";
        String user = "root";
        String password = "";
        Class.forName("com.mysql.jdbc.Driver");
        Connection connection = (Connection)DriverManager.getConnection(url, user, password);
        return connection;
    }
}
