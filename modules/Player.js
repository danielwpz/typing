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

	this.recordScore = function(lan, record, callback) {
		this.getBest(lan, function(err, lastBest) {
			if (lastBest && lastBest.speed > record.speed) {
				callback(err, null);
			}else {
				if (lastBest) {
					mongodb.open(function(err, db) {
						if (err) {
							mongodb.close();
							return callback(err);
						}

						db.collection(lan, function(err, collection) {
							if (err) {
								mongodb.close();
								return callback(err);
							}

							collection.update({name: this.name},
								{$set:record},
								{safe:true},
								function(err, result) {
									mongodb.close();
									callback(err, result);
								});
						});
					});
				}else {
					mongodb.open(function(err, db) {
						if (err) {
							mongodb.close();
							return callback(err);
						}

						db.collection(lan, function(err, collection) {
							if (err) {
								mongodb.close();
								return callback(err);
							}

							record['name'] = this.name;
							collection.insert(record,
								{safe:true},
								function(err, result) {
									mongodb.close();
									callback(err, result);
								});
						});
					});
				}
			}
		});
	};


	this.getBest = function(lan, callback) {
		mongodb.open(function(err, db) {
			if (err) {
				return callback(err);
			}

			db.collection(lan, function(err, collection) {
				if (err) {
					mongodb.close();
					return callback(err);
				}

				collection.findOne({name: this.name},
					function(err, doc) {
						mongodb.close();
						if (doc) {
							callback(err, doc);
						}else {
							callback(err, null);
						}
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
