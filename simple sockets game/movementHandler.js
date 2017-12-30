console.log('------------------------');
console.log('loading movement handler');

var nUsers = 0;
var players = [];

//oooo sooo mooodooolar XD
exports.startup = function(io) { 
    var movementChannel = io.of('/movementChannel');

    setupMovementListner(movementChannel);
}

function setupMovementListner(movementChannel) {
    movementChannel.on('connect', function(socket) {
        
        nUsers++;
        socket.emit('UIDAsign', {UID: nUsers - 1});
        
        socket.emit('localPlayerSetup', { x: 500,
                                          y: 500,
                                          width: 20,
                                          height: 20,
                                          color: 'rgb(255,0,150)', 
                                          size: 20 }
        );

        socket.on('movement', function(positionData) {
            movementChannel.emit('otherPlayerMovement', { x: positionData.x,
                                                          y: positionData.y,
                                                          UID: positionData.UID }
            );
        });

        socket.on('collision', function() {
            /* tell other clients that one of them colided
               and to play the bounce sound (except for one which)
               colided as they already played it */
        });
    });
}

//idea add auto gen userNAME based on random combination of strings

//TODO remame to gameHandler