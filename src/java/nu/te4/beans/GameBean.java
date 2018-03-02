package nu.te4.beans;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.StringReader;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.ejb.Stateless;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.json.JsonValue;

@Stateless
public class GameBean
{ 
    public JsonObject getLevels()
    {
        try
        {
            FileReader levelFile = new FileReader("C:/Users/sebastianmeyer/Webbutveckling/Level Creator/src/java/nu/te4/beans/levels.json");
            JsonReader jsonReader = Json.createReader(levelFile);
            JsonObject levels = jsonReader.readObject();
            return levels;
        }
        catch(Exception e)
        {
            return Json.createObjectBuilder().add("error",e.getMessage()).build();
        }
    }
    
    public void addLevel(String body)
    {
        try
        {
            //läser in den nya leveln till ett jsonObject
            JsonReader jsonReader = Json.createReader(new StringReader(body));
            JsonObject newLevel = jsonReader.readObject();
            jsonReader.close();
            
            //hämtar banorna från levels.json
            JsonArray existingLevels = getLevels().getJsonArray("level");
            
            //skapar object- och array-builders
            JsonObjectBuilder jsonObjectBuilder = Json.createObjectBuilder();
            JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
            
            //lägger till alla existerande levels i arrayen
            for(JsonValue level : existingLevels)
            {
                jsonArrayBuilder.add(level);
            }
            
            //lägger till den nya leveln i arrayen
            jsonArrayBuilder.add(newLevel);
            
            //lägger till arrayen i objektet
            jsonObjectBuilder.add("level", jsonArrayBuilder);
            String levelsJsonString = jsonObjectBuilder.build().toString();
            
            //sparar det nya objektet till levels.json
            FileWriter levelFile = new FileWriter("C:/Users/sebastianmeyer/Webbutveckling/Level Creator/src/java/nu/te4/beans/levels.json");
            levelFile.write(levelsJsonString, 0, levelsJsonString.length());
            levelFile.close();
        }
        catch(Exception e)
        {
            System.out.println("ERROR: " + e.getMessage());
        }
    }
    
    public JsonObject getHighscores()
    {
        //get highscores
        JsonObject highscores;
        JsonArrayBuilder players = Json.createArrayBuilder();
        
        try
        {
            //DB connection
            Connection conn = ConnectionFactory.getConnection();
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM highscores ORDER BY score DESC LIMIT 10");
            ResultSet rs = ps.executeQuery();
            
            //add all players to array
            while(rs.next())
            {
                JsonObject row = Json.createObjectBuilder()
                        .add("player", rs.getString("nickname"))
                        .add("score", rs.getInt("score"))
                        .build();
                players.add(row);
            }
        }
        catch(Exception e)
        {
            JsonObject errorRow = Json.createObjectBuilder()
                    .add("player", "getHighscores error -> " + e.getMessage())
                    .add("score", 500)
                    .build();
            players.add(errorRow);
        }
        
        //build jsonobject
        highscores = Json.createObjectBuilder()
                    .add("players", players)
                    .build();
        
        return highscores;
    }
    
    public void addHighscore(String nickname, int score)
    {
        try
        {
            Connection conn = ConnectionFactory.getConnection();
            PreparedStatement ps = conn.prepareStatement("INSERT INTO highscores VALUES (null, ?, ?)");
            ps.setString(1, nickname);
            ps.setInt(2, score);
            ps.executeUpdate();
        }
        catch(Exception e)
        {
            System.out.println("addHighscore error -> " + e.getMessage());
        }
    }
}
