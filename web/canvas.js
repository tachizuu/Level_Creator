function Canvas()
{
    var canvas = document.getElementById('canvas');
    canvas.width = 700;
    canvas.height = 700;
    var c = canvas.getContext('2d');
    
    var boxes = [];
    var enemies = [];
    
    var editType = "wall";
    
    //punkt1 & punkt2, används för att skapa en box
    var p1 = {};
    var p2 = {};
    var pCursor = {};
    
    //används för att visa en varning om användaren försöker skapa en box som är för liten
    var boxSizeWarning = 0;
    
    canvas.addEventListener("mousedown", function(event)
    {
        var coords = getRelativeCoordinates(event, canvas);
        p1 = coords;
        
        if(editType === "wall")
        {
            
        }
        else if(editType === "enemy")
        {
            createEnemy();
        }
    });
    
    canvas.addEventListener("mousemove", function(event)
    {
        var coords = getRelativeCoordinates(event, canvas);
        pCursor = coords;
            
        if(editType === "wall")
        {
            
        }
        else if(editType === "enemy")
        {
            
        }
    });
    
    canvas.addEventListener("mouseup", function(event)
    {
        var coords = getRelativeCoordinates(event, canvas);
        p2 = coords;
        
        if(editType === "wall")
        {
            createBox();
        }
        else if(editType === "enemy")
        {
            
        }
        
        p1 = {};
    });
    
    document.getElementById("save").addEventListener("click", function()
    {
        saveLevel();
        
    });
    
    //ge radioknapparna eventlisteners
    var radios = document.getElementsByName("editType");
    for(var i = 0; i < radios.length; i++)
    {
        radios[i].addEventListener("change", function()
        {
            editType = this.value;
            p1 = {};
        });
    }
    
    
    function createBox()
    {
        //om boxen är för smal ska den inte läggas till
        if(Math.abs(p2.x - p1.x) < 10 || Math.abs(p2.y - p1.y) < 10)
        {
            showBoxSizeWarning();
        }
        else
        {
            var b = new Box(p1, p2);
            boxes.push(b);
        }
    }
    
    function createEnemy()
    {
        var e = new Enemy(p1);
        enemies.push(e);
    }
    
    function saveLevel()
    {
        //skapa ett level-objekt
        var level =
        {
            "wall":[],
            "enemy":[]
        };
        
        //lägg till boxar i objektet
        for(var i = 0; i < boxes.length; i++)
        {
            var x1 = boxes[i].getX1();
            var x2 = boxes[i].getX2();
            var y1 = canvas.height - boxes[i].getY2();    //y-koordinaterna behöver konverteras eftersom canvas
            var y2 = canvas.height - boxes[i].getY1();    //börjar uppe t. vänster, libgdx börjar nere t. höger
                                       //y1 och y2 måste bytas, eftersom det blir fel med konverteringen pga sorteringen annars
            level.wall.push(
            {
                "x1": x1,
                "x2": x2,
                "y1": y1,
                "y2": y2
            });
        }
        
        //lägg till fiender i objektet
        for(var i = 0; i < enemies.length; i++)
        {
            var x = enemies[i].getX();
            var y = canvas.height - enemies[i].getY(); //y-koordinaten behöver konverteras se ovan ^^^^^^
            level.enemy.push(
            {
                "x": x,
                "y": y
            });
        }
        
        //skicka post-request till backend med leveln som content
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/Level_Creator/api/Levels', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(level));
    }
    
    function showBoxSizeWarning()
    {
        boxSizeWarning = 60;
    }
    
    function renderLoop()
    {
        window.requestAnimationFrame(renderLoop);
        
        //rensa skärmen och rita ut kanten
        c.beginPath();
        c.fillStyle = "black";
        c.rect(0, 0, canvas.width, canvas.height);
        c.fill();
        c.beginPath();
        c.fillStyle = "white";
        c.rect(20, 20, canvas.width - 40, canvas.height - 40);
        c.fill();
        
        if(editType === "wall")
        {
            if(p1 !== {})
            {
                c.beginPath();
                c.rect(p1.x, p1.y, (pCursor.x - p1.x), (pCursor.y - p1.y));
                c.fillStyle = "blue";
                c.fill();
            }
        }
        else if(editType === "enemy")
        {
            c.beginPath();
            c.rect(pCursor.x, pCursor.y - 64, 32, 64);
            c.fillStyle = "blue";
            c.fill();
        }
        
        //boxar
        for(var i = 0; i < boxes.length; i++)
        {
            var x1 = boxes[i].getX1();
            var x2 = boxes[i].getX2();
            var y1 = boxes[i].getY1();
            var y2 = boxes[i].getY2();
            
            c.beginPath();
            c.rect(x1, y1, (x2 - x1), (y2 - y1));
            c.fillStyle = "black";
            c.fill();
        }
        
        //fiender
        for(var i = 0; i < enemies.length; i++)
        {
            var x = enemies[i].getX();
            var y = enemies[i].getY();
            var width = enemies[i].getWidth();
            var height = enemies[i].getHeight();
            c.beginPath();
            c.rect(x, y - 64, width, height);
            c.fillStyle = "yellow";
            c.fill();
        }
        
        if(boxSizeWarning > 0)
        {
            boxSizeWarning--;
            
            var splashWidth = 200;
            var splashHeight = 100;
            var borderWidth = 5;
            var canvasCenterX = canvas.width / 2;
            var canvasCenterY = canvas.height / 2;
            
            //konturbox
            c.beginPath();
            c.rect(canvasCenterX - splashWidth / 2,
                canvasCenterY - splashHeight / 2,
                splashWidth, splashHeight);
            c.fillStyle = "white";
            c.fill();
            
            //meddelandebox
            c.beginPath();
            c.rect(canvasCenterX - splashWidth / 2 + borderWidth / 2,
                    canvasCenterY - splashHeight / 2 + borderWidth / 2,
                    splashWidth - borderWidth, splashHeight - borderWidth);
            c.fillStyle = "black";
            c.fill();
            
            //text
            c.textAlign = "center";
            c.fillStyle = "white";

            c.font = "32px Copperplate Gothic";
            c.fillText("Too small!", canvasCenterX, canvasCenterY);
        }
    }
    
    renderLoop();
}

window.onload = function()
{
    Canvas();
};

//hittade denna funktion på internet, den används för att få exakta koordinater relativa till canvasen
function getRelativeCoordinates(event, reference) {
    var x, y;
    event = event || window.event;
    var el = event.target || event.srcElement;

    if (!window.opera && typeof event.offsetX !== 'undefined') {
      // Use offset coordinates and find common offsetParent
      var pos = { x: event.offsetX, y: event.offsetY };

      // Send the coordinates upwards through the offsetParent chain.
      var e = el;
      while (e) {
        e.mouseX = pos.x;
        e.mouseY = pos.y;
        pos.x += e.offsetLeft;
        pos.y += e.offsetTop;
        e = e.offsetParent;
      }

      // Look for the coordinates starting from the reference element.
      var e = reference;
      var offset = { x: 0, y: 0 };
      while (e) {
        if (typeof e.mouseX !== 'undefined') {
          x = e.mouseX - offset.x;
          y = e.mouseY - offset.y;
          break;
        }
        offset.x += e.offsetLeft;
        offset.y += e.offsetTop;
        e = e.offsetParent;
      }

      // Reset stored coordinates
      e = el;
      while (e) {
        e.mouseX = undefined;
        e.mouseY = undefined;
        e = e.offsetParent;
      }
    }
    else {
      // Use absolute coordinates
      var pos = getAbsolutePosition(reference);
      x = event.pageX  - pos.x;
      y = event.pageY - pos.y;
    }
    // Subtract distance to middle
    return { x: x, y: y };
}