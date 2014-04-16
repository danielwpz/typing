var express = require('express');
var levelManager = require('../modules/LevelManager.js');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res) {
	levelManager({levelPath: './levels/'}, function(err, data) {
		res.render('users', {
			title: 'Challenge',
			layout: 'challenge_layout'
		});
	});
});

module.exports = router;
