function listenModalEvents() {
	$('#registeModal').on('hidden.bs.modal', function(e) {
		makeAble('#register_btn', 'Sign Up');
		cancelChallenge();
	});
	$('#challengeModal').on('hidden.bs.modal', function(e) {
		makeAble('#challenge_btn', 'Challenge');
		cancelChallenge();
	});
	$('#matchModal').on('hidden.bs.modal', function (e) {
		makeAble('#match_btn', 'Match');
		cancelMatch();
	});
	$('#practiceModal').on('hidden.bs.modal', function(e) {
		makeAble('#practice_btn', 'Start');
	});
}

function checkValid(name, pwd) {
	var i;

	if (name.length > 8)
		return 1;
	
	if (pwd.length > 16)
		return 2;

	return 0;
}

function register() {
	var name = $('#name-input').val();
	var pwd = $('#pwd-input').val();
	var pwd2 = $('#pwd2-input').val();
	var err = false;
	console.log('register for ' + name);

	var nameErr = '';
	var pwdErr = '';
	var pwd2Err = '';

	if (checkValid(name, pwd) == 1) {
		// name invalid
		console.log('name invalid');
		nameErr = 'At most 8 letters.';
		err = true;
	}else if (checkValid(name, pwd) == 2) {
		// pwd invalid
		console.log('pwd invalid');
		pwdErr = 'At most 16 letters.';
		err = true;
	}

	if (pwd != pwd2) {
		console.log('Password doesnt match');
		pwd2Err = 'Not same as password.';
		err = true;
	}

	// show error promot
	if (err) {
		$('#register_name_err').text(nameErr);
		$('#register_pwd_err').text(pwdErr);
		$('#register_pwd2_err').text(pwd2Err);
	}else {
		makeDisable('#register_btn', 'Waiting...');
		// register to server
		socket.emit('Register', {
			name: name,
			pwd: pwd,
			pwd2: pwd2
		});
	}
}

function applyInfo() {
	var studentID = $('#id-input').val();
	var phone = $('#phone-input').val();
	var username = $('#username').html();
	sendApply({name: username, studentID: studentID, phone: phone});
}

function sendApply(data) {
	socket.emit('Apply', data);
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

function makeAble(id, text) {
	$(id).removeClass('disabled');
	$(id).text(text);
}

function makeDisable(id, text) {
	$(id).addClass('disabled');
	$(id).text(text);
}

function practice() {
	makeDisable('#practice_btn', 'Waiting...');
	var lan = $('#practice-lanlist').val();
	// store data in local for reuse
	sessionStorage.setItem('last_evt', 'Practice');
	sessionStorage.setItem('last_data', 'Practice');
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
		makeDisable('#challenge_btn', 'Waiting...');
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

function cancelChallenge() {
	var pair = $('#oppo-input').val();

	if (pair != '') {
		var data = {
			type: 'cancel',
			name: pair,
			lan: '0'
		};

		socket.emit('Challenge', data);
	}
}


function match() {
	var lan = $('#match-lanlist').val();
	console.log('lan:' + lan + '\n');

	if (lan != '0') {
		makeDisable('#match_btn', 'Waiting...');
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
