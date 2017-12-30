/* IDEA background is an average (col wheel style)
   of the scores e.g. red - 10 blue - 5 would give a 
   pinkish color */
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var keys = [];
var maxSpeed = 5;
var frictionConst = 0.98; //percentage of V from last frame remaining after friction
var players = [];
players[0] = {x:0,y:0,vX:0,vY:0,size:0,color:0,UID:0};

setInterval(gameLoop, 1000/60);

function gameLoop() {
    update();
    render();
}

function update() {
    //calls function to apply velocity based on key input
    keyManager();
    speedTrimmer();

    //applies friction
    players[0].vX *= frictionConst;
    players[0].vY *= frictionConst;

    if(Math.abs(players[0].vX) < 0.001) { players[0].vX = 0; }
    if(Math.abs(players[0].vY) < 0.001) { players[0].vY = 0; }

    //avoids calling collision and other movement related functions if unneccesary
    if(Math.abs(players[0].vX) > 0 || Math.abs(players[0].vY) > 0) {
        //applys velocity to players[0]
        players[0].x += players[0].vX;
        players[0].y += players[0].vY;

        collisionHandler();
        tellServerMovement(players[0].x, players[0].y);
    }
}

function render() {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //draws all players including local
    for(var i = 0; i < players.length; i++) {
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(players[i].x, players[i].y, 20, 20);
    }
}

function collisionHandler() {
    detectWallCollision();
}

function detectWallCollision() {
    var bounceSound = document.getElementById('bounce'); //little bit inefficent, modular tho.
    var collision = false;
    var bounceVolume = 0;

    //wall colision
    //seems like this could be simpler
    if(players[0].x < 0) {
        players[0].x = 0
        players[0].vX *= -1;
        bounceVolume = Math.abs(players[0].vX) / maxSpeed; //bit sketchy
        collision = true;
    } else if(players[0].x + players[0].size > canvas.width) {
        players[0].x = canvas.width - players[0].size;
        players[0].vX *= -1;
        bounceVolume = Math.abs(players[0].vX) / maxSpeed;
        collision = true;
    }

    if(players[0].y < 0) {
        players[0].y = 0
        players[0].vY *= -1;
        bounceVolume = Math.abs(players[0].vY) / maxSpeed;
        collision = true;
    } else if(players[0].y + players[0].size > canvas.height) {
        players[0].y = canvas.height - players[0].size;
        players[0].vY *= -1;
        bounceVolume = Math.abs(players[0].vY) / maxSpeed;
        collision = true;
    }

    //reduced amount of code and simplified
    if(collision) {
        bounceSound.volume = bounceVolume; //V. sketchy
        bounceSound.play();
        tellServerCollision();
    }
}

function keyManager() {
    if (keys[38] && players[0].vY > -maxSpeed) { players[0].vY -= 0.5; }
    if (keys[40] && players[0].vY < maxSpeed) { players[0].vY += 0.5; }
    if (keys[39] && players[0].vX < maxSpeed) { players[0].vX += 0.5; }
    if (keys[37] && players[0].vX > -maxSpeed) { players[0].vX -= 0.5; }
}

/* ensures that V{axis} never excedes max speed. wouldn't be a 
problem except for bounce sound volume */
function speedTrimmer() {
    if(players[0].vX > maxSpeed){ players[0].vX = maxSpeed; }
    if(players[0].vX < -maxSpeed){ players[0].vX = -maxSpeed; }

    if(players[0].vY > maxSpeed){ players[0].vY = maxSpeed; }
    if(players[0].vY < -maxSpeed){ players[0].vY = -maxSpeed; }
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});