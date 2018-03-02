function Box(p1, p2)
{
    var x1 = p1.x;
    var x2 = p2.x;
    var y1 = p1.y;
    var y2 = p2.y;
    
    //sorterar värdena(x1 måste vara mindre än x2, y1 måste vara mindre än y2)
    if(x1 > x2)
    {
        var temp = x1;
        x1 = x2;
        x2 = temp;
    }
    if(y1 > y2)
    {
        var temp = y1;
        y1 = y2;
        y2 = temp;
    }
    
    this.getX1 = function()
    {
        return x1;
    };
    
    this.getX2 = function()
    {
        return x2;
    };
    
    this.getY1 = function()
    {
        return y1;
    };
    
    this.getY2 = function()
    {
        return y2;
    };
}