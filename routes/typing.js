var express = require('express');
var levelManager = require('../modules/LevelManager.js');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res) {
	if (req.session && req.session.pairIndex >= 0) {
		levelManager({levelPath: './levels/'}, function(err, data) {
			res.render('typing', {
				title: 'Challenge',
				layout: 'challenge_layout',
				code: data
			});
		});
	}else {
		res.end('You should register or challenge first.');
	}
});

module.exports = router;
