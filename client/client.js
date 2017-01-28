var socket = io();
var playerNumber;

//signin
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');

//complete turn button
var completeTurn = document.getElementById('completeTurn');
completeTurn.disabled = true;

//emit object with username to server when clicking sign in button
signDivSignIn.onclick = function() {
    socket.emit('signIn', {username: signDivUsername.value});
}
socket.on('signInResponse', function(data){
    if (data.success) {
        console.log('found');
    }
    else
        alert("sign in unsuccessful");
});            

socket.on('cardUpdate', function(data){
    //update names on cards
    document.getElementById("user1").innerHTML = data.user1.name;
    document.getElementById("user2").innerHTML = data.user2.name;
    document.getElementById("user3").innerHTML = data.user3.name;
    document.getElementById("user4").innerHTML = data.user4.name;
                
    //show cards
    signDiv.style.display = 'none';
    gameDiv.style.display = 'inline-block';
});

socket.on('gameStart', function(data){
    console.log(data.msg + (data.nbr+1));
    playerNumber = (data.nbr+1);

    //unlock button for player 1
    if (playerNumber === 1)
        completeTurn.disabled = false;
});

socket.on('turnStart', function(data){
    //unlock button for number sent from server
    if (playerNumber === data.player){
        completeTurn.disabled = false;
    } 
});

completeTurn.onclick = function(){
    if (playerNumber === 1){
        socket.emit('playerOneResponse', {message: 'player one has completed their turn'});
    }
    else if (playerNumber === 2){
        socket.emit('playerTwoResponse', {message: 'player two has completed their turn'});
    }
    else if (playerNumber === 3){
        socket.emit('playerThreeResponse', {message: 'player three has completed their turn'});
    }
    else if (playerNumber === 4){
        socket.emit('playerFourResponse', {message: 'player four has completed their turn'});
    }
    //disable button for all players
    completeTurn.disabled = true;
}
