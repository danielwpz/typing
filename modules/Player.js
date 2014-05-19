function Player(name, socket, session) {
	this.name = name;
	this.socket = socket;
	this.session = session;
	this.state = 'normal';
}

module.exports = Player;
