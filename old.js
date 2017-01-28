//dependencies
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv, {});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');//sending html page
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('server started');

var SOCKET_LIST = {};
var PLAYER_LIST = {};

/*
var Player = function(id){
    var self = {
        x:250,
        y:250,
        id:id,
        number:"" + Math.floor(10 * Math.random()),
        pressingRight: false,
        pressingLeft: false,
        pressingUp: false,
        pressingDown: false,
        maxSpd:10
    }

    self.updatePosition = function(){
        if(self.pressingRight)
            self.x += self.maxSpd;
        if(self.pressingLeft)
            self.x -= self.maxSpd;
        if(self.pressingUp)
            self.y -= self.maxSpd;
        if(self.pressingDown)
            self.y += self.maxSpd;
    }
    return self;
}

Player.onConnect = function(socket) {
    var player = Player(socket.id);
}
*/
var USERS = [];

io.sockets.on('connection', function(socket){//event listener

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    //listening for sign in
    socket.on('signIn', function(data){
        //Player.onConnect(socket);
        socket.emit('signInResponse',{success:true}); 
        console.log('success ' + data.username + ' ' + socket.id);
        USERS.push({
            name: data.username,
            SID: socket.id
        });
        console.log(USERS);

        //update all players
        if (USERS.length === 4)
        io.sockets.emit('cardUpdate',{
            user1: {name: USERS[0].name}, 
            user2: {name: USERS[1].name},
            user3: {name: USERS[2].name},
            user4: {name: USERS[3].name}
        });
    });

    //var player = Player(socket.id);
    //PLAYER_LIST[socket.id] = player;

    console.log('socket connection ' + socket.id);

    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });
    /*
    socket.on('keyPress', function(data){
        if (data.inputId === 'left')
            player.pressingLeft = data.state;
        else if (data.inputId === 'right')
            player.pressingRight = data.state;
        else if (data.inputId === 'up')
            player.pressingUp= data.state;
        else if (data.inputId === 'down')
            player.pressingDown = data.state;
    });
    */
});

/*
setInterval (function(){
    var pack = [];
    for (var i in PLAYER_LIST){
        var player = PLAYER_LIST[i];
        player.updatePosition();
        pack.push({
            x:player.x,
            y:player.y,
            number: player.number
        });
    
    for (var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions', pack);
    }

        
    }

}, 1000/25)

/*
use socket.emit to send updated state to all players
    (for i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.x++;
        socket.y++;

        socket.emit('newPosition', {
            x: socket.x,
            y: socket.y
        });
    }

*/

