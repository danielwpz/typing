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

function practice() {

}

function challenge() {
	var lan = $('#challenge-lanlist').val();
	var pair = $('#oppo-input').val();

	console.log('lan:' + lan + '\n');
	console.log('oppo:' + pair + '\n');

	if (lan != '0' && pair != '') {
		socket.emit('Challenge', {
			type: 'try', 
			name: pair,
			lan: lan
		});
	}
}

function match() {
	var lan = $('#match-lanlist').val();
	console.log('lan:' + lan + '\n');

	if (lan != '0') {
		socket.emit('Match', {
			type: 'try',
			lan: lan
		});
	}
}

function cancelMatch() {
	socket.emit('Match', {
		type: 'cancel'
	});
}
