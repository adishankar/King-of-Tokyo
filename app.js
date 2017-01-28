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
var SOCKET_LIST2 = [];
var PLAYER_LIST = {};
var USERS = [];

io.sockets.on('connection', function(socket){//event listener

    console.log('socket connection ' + socket.id);

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    SOCKET_LIST2.push(socket);

    //listening for sign in
    socket.on('signIn', function(data){
        
        socket.emit('signInResponse',{success:true}); 
        console.log('success ' + data.username + ' ' + socket.id);
        USERS.push({
            name: data.username,
            SID: socket.id
        });
        console.log(USERS);

        //update all players
        if (USERS.length === 4) {
            io.sockets.emit('cardUpdate',{
                user1: {name: USERS[0].name}, 
                user2: {name: USERS[1].name},
                user3: {name: USERS[2].name},
                user4: {name: USERS[3].name}
            });

            //testing stuff here
            for (var i=0; i<4; i++){
                var currentSocket = SOCKET_LIST2[i];
                console.log('emitting to ' + USERS[i].name);
                currentSocket.emit('gameStart', {msg: 'you are player ', nbr: i});
            }  
        } 
    });

    //here's an idea listen for response with headers for each player
    socket.on('playerOneResponse', function(){
        console.log('player one turn completed');
        //emit to player two
        io.sockets.emit('turnStart', {player: 2});
    });
    socket.on('playerTwoResponse', function(){
        console.log('player two turn completed');
        //emit to player three
        io.sockets.emit('turnStart', {player: 3});
    });
    socket.on('playerThreeResponse', function(){
        console.log('player three turn completed');
        //emit to player four
        io.sockets.emit('turnStart', {player: 4});
    });
    socket.on('playerFourResponse', function(){
        console.log('player four turn completed');
        //emit to player one
        io.sockets.emit('turnStart', {player: 1});
    });

    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });

});