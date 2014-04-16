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

var routes = require('./routes/index');
var typing = require('./routes/typing');

var cookieParser = CookieParser('secret');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Sio = require('session.socket.io');
var sio = new Sio(io, sessionStore, cookieParser, 'connect.sid');

app.set('port', process.env.PORT || 8080);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser);
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(session({key: 'connect.sid', secret: 'secret', store: sessionStore}));

app.use('/', routes);
app.use('/typing', typing);

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

/*****************
 *    Classes    *
 *****************/

// we need Engine to handler custom events
function Engine() {
}
util.inherits(Engine, events.EventEmitter);

function Player(name, socket, session) {
	this.name = name;
	this.socket = socket;
	this.session = session;
	this.state = 'normal';
}

/*********************
 *    Global vars    *
 *********************/
var userList = {};
var pairList = new Array();

var engine = new Engine();
/* Register event for Engine */
engine.on('pair-made', function(p1, p2) {
	p1.socket.emit('_Reply', {
		type: 'Challenge', 
		result: 'start',
		page: '/typing'
	});
	p2.socket.emit('_Reply', {
		type: 'Challenge', 
		result: 'start',
		page: '/typing'
	});
});

engine.on('pair-ready', function(index) {
	console.log('one ready.\n');
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

function isRegistered(name) {
	return (userList[name] != null && userList[name] != undefined);
}

function getName(session) {
	if (session && session.name)
		return session.name;
	else
		return null;
}

function makePair(player1, player2) {
	var index = pairList.length;

	player1.session.pairIndex = index;
	player2.session.pairIndex = index;
	player1.session.save();
	player2.session.save();
	
	pairList.push({
		player1: player1.name, 
		player2: player2.name,
		player1_online: false,
		player2_online: false
	});

	// fire event
	engine.emit('pair-made', player1, player2);
}

function tryChallenge(name, pairName) {
	var player = userList[name];
	var pair = userList[pairName];

	player.state = 'waiting';

	if (pair && pair.state != 'racing') {
		if (pair.state == 'waiting') {
			makePair(player, pair);
		}else if (pair.state == 'normal') {
			pair.socket.emit('_Challenge', {name: name});
		}
	}else {
		player.socket.emit('_Reply', {type: 'Challenge', result: 'nonavail'});
	}
}

function rejectChallenge(name, pairName) {
	var player = userList[name];
	var pair = userList[pairName];

	player.state = 'normal';
	pair.state = 'normal';

	pair.socket.emit('_Reply', {type: 'Challenge', result: 'reject'});
}

/*******************
 *    socket.io    *
 *******************/
sio.on('connection', function(err, socket, session) {
	// check session
	if (getName(session)) {
		userList[session.name].socket = socket;
	}

	socket.on('Register', function(data) {
		var name = getName(session);
		console.log('Register: ' + data.name);

		if (name == null) {
			name = data.name;

			// check whether the name already existed
			if (!isRegistered(name)) {
				userList[name] = new Player(name, socket, session);

				session.name = data.name;
				session.save();
				// reply
				socket.emit('_Reply', {type: 'Register', result: 'ok'});
			}else {
				socket.emit('_Reply', {
					type: 'Register', 
					result: 'exist'
				});
			}
		}else {
			socket.emit('_Reply', {
				type: 'Register', 
				result: 'already'
			});
		}
	});

	socket.on('Challenge', function(data) {
		var name = getName(session);
		var pair = data.name;
		var type = data.type;
		console.log('Challenge: ' + name + ' -> ' + pair);

		if (name && type == 'try') {
			tryChallenge(name, pair);
		}else if (name && type == 'reject'){
			rejectChallenge(name, pair);
		}else {
			socket.emit('_Reply', {
				type: 'Challenge', 
				result: 'unregister'
			});
		}
	});

});

sio.of('/challenge').on('connection', function(err, socket, session) {
	// we hold the belief that when a player
	// gets to this point, his session must be valid.
	var name = getName(session);
	var pairIndex = session.pairIndex;
	var pair;

	userList[name].socket = socket;
	
	if (pairList[pairIndex].player1 == name) {
		// Tell the pair that I am online.
		pairList[pairIndex].player1_online = true;
		// Check if my component is also online.
		if (pairList[pairIndex].player2_online) {
			engine.emit('pair_ready', pairIndex);
		}
	}else if (pairList[pairIndex].player2 == name) {
		// Tell the pair that I am online.
		pairList[pairIndex].player2_online = true;
		// Check if my component is also online.
		if (pairList[pairIndex].player1_online) {
			engine.emit('pair-ready', pairIndex);
		}
	}

});

module.exports = app;
