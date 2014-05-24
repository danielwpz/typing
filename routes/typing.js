var levelManager = require('../modules/LevelManager.js');


/* GET users listing. */
function doTyping(req, res) {
	if (req.session && req.session.pairIndex >= 0) {
		var lan = req.params.lan;
		var path = './levels/' + lan + '/';
		levelManager({levelPath: path}, function(err, data) {
			res.render('typing', {
				title: 'Challenge',
				layout: 'challenge_layout',
				code: data
			});
		});
	}else {
		res.end('You should register or challenge first.');
	}
}

module.exports = doTyping;
