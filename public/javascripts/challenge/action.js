function register() {
	var name = $('#name-input').val();
	console.log(name);

	// register to server
	socket.emit('Register', {name: name});


}

function challenge() {
	var pair = $('#pair-name-input').val();

	socket.emit('Challenge', {type: 'try', name: pair});
}

//back to homepage after game
function back() {

}

//play again with the same mode 
function playAgain() {

}
