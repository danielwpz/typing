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
