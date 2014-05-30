var express = require('express');
var partials = require('express-partials');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var CookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect = require('connect');
var session = require('express-session');
var sessionStore = new session.MemoryStore();
var crypto = require('crypto');

var routes = require('./routes/index');
var typing = require('./routes/typing');
var practice = require('./routes/practice');

var cookieParser = CookieParser('secret');

var app = express();
var config = require('./config.js');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {'log level': 0});
var Sio = require('session.socket.io');
var sio = new Sio(io, sessionStore, cookieParser, 'connect.sid');
var serverPort = config.port;

app.set('port', process.env.PORT || serverPort);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser);
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(session({key: 'connect.sid', secret: 'secret', store: sessionStore}));

app.use('/typing/:lan', function(req, res) {
	if (req.session && req.session.pairIndex && req.session.pairIndex >=0) {
		var myName = req.session.name;
		var pairName = getPairName(req.session.pairIndex, myName);
		typing(req, res, myName, pairName);
	}else {
		res.end('Unregistered or no-match');
	}
});
app.use('/practice/:lan', practice);
app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(app.get('port'), function() {
	console.log('Express server listening on ' + app.get('port'));
});

/* ================================================== */
var events = require('events');
var util = require('util');
var Player = require('./modules/Player.js');
var MatchPicker = require('./modules/MatchPicker.js');

/*****************
 *    Classes    *
 *****************/

// we need Engine to handler custom events
function Engine() {
}
util.inherits(Engine, events.EventEmitter);

/*********************
 *    Global vars    *
 *********************/
var userList = {};
userList[""] = null;
var pairList = new Array();
var matchPicker = new MatchPicker();

// The first slot of pairList is reversed 
// for practice mode
pairList.push({});

var engine = new Engine();
/* Register event for Engine */
engine.on('pair-made', function(index) {
	var p1 = userList[pairList[index].player1];
	var p2 = userList[pairList[index].player2];
	var lan = pairList[index].lan;

	p1.socket.emit('_Reply', {
		type: 'Challenge', 
		result: 'start',
		page: '/typing/' + lan
	});
	p2.socket.emit('_Reply', {
		type: 'Challenge', 
		result: 'start',
		page: '/typing/' + lan
	});
});

engine.on('pair-ready', function(index) {
	console.log('Pair[' + index + '] ready.\n');
	var player1 = userList[pairList[index].player1];
	var player2 = userList[pairList[index].player2];

	// bind each other's socket
	player1.socket.set('pair', player2, function() {
		player2.socket.set('pair', player1, function() {
			player1.state = 'racing';
			player2.state = 'racing';
			player1.socket.emit('_Start');
			player2.socket.emit('_Start');
		});
	});
});

function isOnline(name) {
	return (userList[name] && userList[name].socket);
}

function getName(session) {
	if (session && session.name)
		return session.name;
	else
		return null;
}

function getPairName(index, myName) {
	var p1Name = pairList[index].player1;
	var p2Name = pairList[index].player2;

	if (p1Name == myName) {
		return p2Name;
	}else {
		return p1Name;
	}
}
	
function makePair(player1, player2, lan) {
	var index = pairList.length;

	player1.session.pairIndex = index;
	player2.session.pairIndex = index;
	player1.session.save();
	player2.session.save();
	
	pairList.push({
		player1: player1.name, 
		player2: player2.name,
		player1_online: false,
		player2_online: false,
		lan: lan
	});

	// fire event
	engine.emit('pair-made', index);
}

function tryChallenge(name, pairName, lan) {
	var player = userList[name];
	var pair = userList[pairName];

	player.state = 'waiting';

	if (pair && pair.socket == null) {
		// lazy removing
		makeOffline(pairName);

		player.socket.emit('_Reply', {
			type: 'Challenge', 
			result: 'not-online'
		});
	}else {
		if (pair && pairName != name && pair.state != 'racing') {
			if (pair.state == 'waiting') {
				matchPicker.clear(pairName);
				makePair(player, pair, lan);
			}else if (pair.state == 'normal') {
				pair.socket.emit('_Challenge', {
					name: name,
					lan: lan
				});
			}
		}else {
			var errdesc = 'nonavail';
			if (pair && pair.state == 'racing') {
				errdesc = 'racing';
			}
			player.socket.emit('_Reply', {
				type: 'Challenge', 
				result: errdesc
			});
		}
	}
}

function rejectChallenge(name, pairName) {
	var player = userList[name];
	var pair = userList[pairName];

	player.state = 'normal';
	pair.state = 'normal';

	pair.socket.emit('_Reply', {type: 'Challenge', result: 'reject'});
}

function isOnline(name) {
	return (userList[name] && userList[name].socket);
}

function makeOnline(name, socket, session) {
	userList[name] = new Player(name, socket, session);

	session.name = name;
	session.save();
}

function makeOffline(name) {
	userList[name] = null;
	delete userList.name;
	console.log('Make "' + name + '" off line.\n');
}

/*******************
 *    socket.io    *
 *******************/
sio.on('connection', function(err, socket, session) {
	// check session
	if (getName(session)) {
		if (userList[session.name]) {
			userList[session.name].socket = socket;
		}else {
			// previous off-line, but session log in
			makeOnline(session.name, socket, session);
		}
	}

	socket.on('Register', function(data) {
		var name = getName(session);
		console.log('Register: ' + data.name);

		if (name == null) {
			name = data.name;
			var pwd = data.pwd;
			var pwd2 = data.pwd2;

			// check if pwd is valid
			if (pwd != pwd2) {
				socket.emit('_Reply', {
					type:'Register',
					result:'inval-pwd'
				});

				return;
			}

			var md5 = crypto.createHash('md5');
			var secretPwd = md5.update(pwd).digest('base64');

			// check whether the name already existed
			Player.get(name, function(err, player) {
				if (player == null) {
					var player = new Player(name, socket, session);
					player.pwd = secretPwd;

					player.save(function(err) {
						if (err) {
							console.log('save player error:' + err);
							socket.emit('_Reply', {
								type: 'Register',
								result: 'unknown-err'
							});
						}else {
							makeOnline(name, socket, session);

							socket.emit('_Reply', {
								type: 'Register',
								result: 'ok'
							});
						}
					});
				}else {
					socket.emit('_Reply', {
						type: 'Register',
						result: 'exist'
					});
				}
			});
		}else {
			socket.emit('_Reply', {
				type: 'Register', 
				result: 'already'
			});
		}
	});

	socket.on('SignIn', function(data) {
		var md5 = crypto.createHash('md5');
		var secretPwd = md5.update(data.pwd).digest('base64');

		if (isOnline(data.name)) {
			socket.emit('_Reply', {
				type: 'SignIn',
				result: 'already-online'
			});
		}else {
			// check whether the name already existed
			Player.get(data.name, function(err, player) {
				if (err) {
					console.log('get player err:' + err);
					socket.emit('_Reply', {
						type: 'SignIn',
						result: 'unknown-err'
					});
					return;
				}

				if (player && player.pwd == secretPwd) {
					makeOnline(data.name, socket, session);
					socket.emit('_Reply', {
						type: 'SignIn',
						result: 'ok'
					});
				}else {
					socket.emit('_Reply', {
						type: 'Register',
						result: 'bad-info'
					});
				}
			});
		}
	});
		

	socket.on('Challenge', function(data) {
		var name = getName(session);
		var pair = data.name;
		var type = data.type;
		var lan  = data.lan;
		console.log('Challenge[' + lan + ']: ' + name + ' -> ' + pair);

		if (name && type == 'try') {
			tryChallenge(name, pair, lan);
		}else if (name && type == 'reject'){
			rejectChallenge(name, pair);
		}else {
			socket.emit('_Reply', {
				type: 'Challenge', 
				result: 'unregister'
			});
		}
	});

	socket.on('Match', function(data) {
		var name = getName(session);
		console.log('Find Match for: ' + name + '\n');

		if (name && data.type == 'try') {
			var player = userList[name];
			player.state = 'waiting';

			while(true) {
				var pairName = matchPicker.match(name, data);
				var pair = userList[pairName];

				if (pairName != "" && pair) {
					if (pair.socket) {
						console.log('Match: ' + name + 
							' & ' + pairName + '\n');
						makePair(player, pair, data.lan);
						break;
					}else {
						// Pair is off-line, according to lazy-removing
						// we remove him from userList
						makeOffline(pairName);
						// since it seems like there is no previous 
						// waiting matcher, we re-match current user 
						// to make him wait
						continue;
					}
				}
				break;
			}
		}else if (name && data.type == 'cancel') {
			var player = userList[name];
			player.state = 'normal';
			matchPicker.clear(name);
			console.log(name + ' cancel match.\n');
		}else {
			socket.emit('_Reply', {
				type: 'Match',
				result: 'unregister'
			});
		}
	});

	socket.on('Logout', function() {
		var name = getName(session);
		makeOffline(name);
		matchPicker.clear(name);
		session.name = null;
		session.pairIndex = null;
		session.save();
	});

	socket.on('disconnect', function() {
		var name = getName(session);
		if (name && name != '') {
			console.log('"' + name + '" socket break on /.\n');
			// By 'disconnect', we only know that the 
			// current socket is unavailble, but that
			// user may still be active because of
			// page redirections, etc.
			userList[name].socket = null;
			// match waiting could be removed
			matchPicker.clear(name);
		}
	});
});

sio.of('/challenge').on('connection', function(err, socket, session) {
	// we hold the belief that when a player
	// gets to this point, his session must be valid.
	if (!session){
		return;
	}
	var name = getName(session);
	var pairIndex = session.pairIndex;

	console.log(name + ' connect to challenge.\n');
	userList[name].socket = socket;
	
	socket.on('Established', function(data) {
		console.log(name + ' send establish.\n');
		try{
			if (pairList[pairIndex].player1 == name) {
				// Tell the pair that I am online.
				pairList[pairIndex].player1_online = true;
				// Reply
				console.log('Reply estab to ' + name + '\n');
				socket.emit('_Reply', {
					type: 'Established',
					result: 'ok'
				});
				// Check if my component is also online.
				if (pairList[pairIndex].player2_online) {
					engine.emit('pair-ready', pairIndex);
				}
			}else if (pairList[pairIndex].player2 == name) {
				// Tell the pair that I am online.
				pairList[pairIndex].player2_online = true;
				// Reply
				console.log('Reply estab to ' + name + '\n');
				socket.emit('_Reply', {
					type: 'Established',
					result: 'ok'
				});
				// Check if my component is also online.
				if (pairList[pairIndex].player1_online) {
					engine.emit('pair-ready', pairIndex);
				}
			}
		}catch(e) {
			console.log(name + ' establish error:' + e);
			socket.emit('_Reply', {
				type: 'Established',
				result: 'unknown-err'
			});
		}
			
	});

	socket.on('Update', function(data) {
		socket.get('pair', function(err, pair) {
			if (err) {
				console.log('Get socket pair err.\n');
			}else {
				// just forward
				try {
					pair.socket.emit('_Update', data);
				}catch(err) {
					console.log("On 'Update' error." + err + '\n');
				}
			}
		});
	});

	socket.on('Finish', function(data) {
		socket.get('pair', function(err, pair) {
			if (err) {
				console.log('Get socket pair err.\n');
			}else {
				// just forward
				try {
					pair.socket.emit('_Finish', data);
					// clear all pair info
					pairList[pairIndex] = null;
					// clear user's pair info
					session.pairIndex = null;
					session.save();
					pair.session.pairIndex = null;
					session.save();

					// change state to normal
					pair.state = 'normal';
					userList[name].state = 'normal';
				}catch(err) {
					console.log("On 'Finish' error." + err + '\n');
				}
			}
		});
	});

		

	socket.on('disconnect', function() {
		var name = getName(session);
		if (name && name != '') {
			console.log('"' + name + '" socket break on "challenge"\n');
			// By 'disconnect', we only know that the 
			// current socket is unavailble, but that
			// user may still be active because of
			// page redirections, etc.
			userList[name].socket = null;
			userList[name].state = 'normal';
			// match waiting could be removed
			matchPicker.clear(name);
		}
	});
});

module.exports = app;
