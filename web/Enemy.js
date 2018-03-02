function Enemy(p)
{
    var x = p.x;
    var y = p.y;
    var width = 32;
    var height = 64;
    
    this.getX = function()
    {
        return x;
    };
    
    this.getY = function()
    {
        return y;
    };
    
    this.getWidth = function()
    {
        return width;
    };
    
    this.getHeight = function()
    {
        return height;
    };
}