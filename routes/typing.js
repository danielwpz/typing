var levelManager = require('../modules/LevelManager.js');


/* GET users listing. */
function doTyping(req, res, myName, pairName) {
	var lan = req.params.lan;
	var path = './levels/' + lan + '/';
	levelManager({levelPath: path}, function(err, data) {
		res.render('typing', {
			title: 'Challenge',
			layout: 'challenge_layout',
			code: data,
			myName: myName,
			pairName: pairName
		});
	});
}

module.exports = doTyping;
