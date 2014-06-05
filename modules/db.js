var config = require('../config.js');
var Db = require('mongodb').Db;
var DbConnection = require('mongodb').Connection;
var DbServer = require('mongodb').Server;

module.exports = new Db(config.db, new DbServer(config.host,
			DbConnection.DEFAULT_PORT, {}));
