function register() {
	var name = $('#name-input').val();
	console.log(name);
	var pwd = $('#pwd-input').val();
	var pwd2 = $('#pwd2-input').val();

	if (pwd != pwd2) {
		console.log('Password doesnt match');
		return;
	}

	// register to server
	socket.emit('Register', {
		name: name,
		pwd: pwd,
		pwd2: pwd2
	});


}

function signIn() {
	var name = $('#signin-name').val();
	var pwd = $('#signin-pwd').val();

	socket.emit('SignIn', {
		name: name,
		pwd: pwd
	});
}

function challenge() {
	var pair = $('#pair-name-input').val();

	socket.emit('Challenge', {type: 'try', name: pair});
}

function match() {
	socket.emit('Match', {lan:'C'});
}
