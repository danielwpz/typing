var mongodb = require('./db.js');

function Player(name, socket, session) {
	this.name = name;
	this.pwd = '';
	this.socket = socket;
	this.session = session;
	this.state = 'normal';

	this.save = function(callback) {
		var player = {
			name: this.name,
			pwd: this.pwd,
		};

		mongodb.open(function(err, db) {
			if (err) {
				return callback(err);
			}

			db.collection('player', function(err, collection) {
				if (err) {
					mongodb.close();
					return callback(err);
				}

				collection.ensureIndex('name', {unique: true});

				collection.insert(player, 
					{safe: true}, 
					function(err, player) {
						mongodb.close();
						callback(err, player);
					}
					);
			});
		});
	};
}


module.exports = Player;
module.exports.fuck = function() {
	console.log('fuck');
};

module.exports.get = function(playerName, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('player', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			collection.findOne({name: playerName},
				function(err, doc) {
					mongodb.close();
					if (doc) {
						var player = new Player(playerName, null, null);
						player.pwd = doc.pwd;
						callback(err, player);
					}else {
						callback(err, null);
					}
				}
				);
		});
	});
};
