package nu.te4.services;

import javax.ejb.EJB;
import javax.json.JsonObject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import nu.te4.beans.GameBean;

@Path("/")
public class GameService
{
    @EJB
    GameBean gameBean;
    
    @GET
    @Path("Levels")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLevels()
    {
        return Response.ok(gameBean.getLevels()).build();
    }
    
    @POST
    @Path("Levels")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addLevel(String body)
    {
        gameBean.addLevel(body);
        return Response.ok().build();
    }
    
    @GET
    @Path("Highscores")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getHighscores()
    {
        return Response.ok(gameBean.getHighscores()).build();
    }
    
    @POST
    @Path("Highscores")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addHighscore(JsonObject player)
    {
        try
        {
            String nickname = player.getString("nickname");
            int score = player.getInt("score");
            gameBean.addHighscore(nickname, score);
            return Response.ok().build();
        }
        catch(Exception e)
        {
            return Response.status(400).build();
        }
    }
}