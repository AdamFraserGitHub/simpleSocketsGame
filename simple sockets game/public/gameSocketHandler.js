var movementChannel = io('/movementChannel');

movementChannel.on('connect', function() {
    console.log('connected');
});

movementChannel.on('UIDAsign', function(userID) { players[0].UID = userID.UID; }); //sets unique UID to identify self to server. possibly replace with server side code.

movementChannel.on('localPlayerSetup', function(data){
    players[0].x = data.x;
    players[0].y = data.y;

    players[0].size = data.size;

    players[0].color = data.color;

    players[0].live = true;
});

movementChannel.on('otherPlayerMovement', function(moveData) {
    if(moveData.UID != players[0].UID) {
        var existsOrID = searchPlayers(moveData.UID);
        if(existsOrID == -1) {
            var workingIndex = createNewPlayerObj(moveData.UID);
            players[workingIndex].UID = moveData.UID;
            players[workingIndex].x = moveData.x;
            players[workingIndex].y = moveData.y; //unneccesary reppition
            players[workingIndex].live = true;
        } else {
            players[existsOrID].UID = moveData.UID;
            players[existsOrID].x = moveData.x;
            players[existsOrID].y = moveData.y;
            players[existsOrID].live = true;
        }
    }
});

function tellServerCollision() {
    movementChannel.emit('collision');
}

function tellServerMovement() {
    movementChannel.emit('movement', { x: players[0].x,
                                       y: players[0].y, 
                                       UID: players[0].UID }
    );
}

function createNewPlayerObj(ID) {
    players.push(new Object());
    return players.length - 1; //index of current doo dad
}

function searchPlayers(IDToCheck) {
    for(var i = 1; i < players.length; i++) {
        if(players[i].UID == IDToCheck) { return i; }
        // console.log(players[i].UID);
    }
    return -1;
}