var events = require('events');

function ChallengeBoard() {

	events.EventEmitter.call(this);

}

function tryChallenge(name, pairName) {
	var player = userList[name];
	var pair = userList[pairName];

	player.state = 'ready';

	if (pair && pair.state != 'racing') {
		if (pair.state == 'ready') {
			makePair(player, pair);
		}else if (pair.state == 'normal') {
			pair.socket.emit('_Challenge', {name: name});
		}
	}else {
		player.socket.emit('_Reply', {type: 'Challenge', result: 'non-avail'});
	}
}

module.exports = ChallengeBoard;
module.exports.tryChallenge = tryChallenge;
