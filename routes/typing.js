var express = require('express');
var levelManager = require('../modules/LevelManager.js');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res) {
	levelManager({levelPath: './levels/'}, function(err, data) {
		res.render('typing', {
			title: 'Challenge',
			layout: 'challenge_layout',
			code: data
		});
	});
});

module.exports = router;
