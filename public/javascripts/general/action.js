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

function logout() {
	socket.emit('Logout', {});
	// refresh the page
	var hostPath = window.location.hostname;
	var hostPort = window.location.port;
	window.location.assign('http://' + hostPath + ':' + hostPort);
}

function practice() {
	var lan = $('#practice-lanlist').val();
	// redirect the page
	var hostPath = window.location.hostname;
	var hostPort = window.location.port;
	window.location.assign('http://' + hostPath + ':' + hostPort
			+ '/practice/' + lan);
}

function challenge() {
	var lan = $('#challenge-lanlist').val();
	var pair = $('#oppo-input').val();

	console.log('lan:' + lan + '\n');
	console.log('oppo:' + pair + '\n');

	if (lan != '0' && pair != '') {
		var data = {
			type: 'try', 
			name: pair,
			lan: lan
		};
			
		// store data in local for reuse
		sessionStorage.setItem('last_evt', 'Challenge');
		sessionStorage.setItem('last_data', JSON.stringify(data));

		socket.emit('Challenge', data);
	}
}

function match() {
	var lan = $('#match-lanlist').val();
	console.log('lan:' + lan + '\n');

	if (lan != '0') {
		var data = {
			type: 'try',
			lan: lan
		};

		// store data in local for reuse
		sessionStorage.setItem('last_evt', 'Match');
		sessionStorage.setItem('last_data', JSON.stringify(data));
		
		socket.emit('Match', data);
	}
}

function cancelMatch() {
	socket.emit('Match', {
		type: 'cancel'
	});

}
