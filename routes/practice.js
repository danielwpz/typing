var levelManager = require('../modules/LevelManager.js');

function doPractice(req, res) {
	var name = "";
	var lan = req.params.lan;
	var path = './levels/' + lan + '/';
	if (req.session && req.session.name) {
		name = req.session;
	}

	levelManager({levelPath: path}, function(err, data) {
		res.render('typing', {
			title: 'Practice',
			layout: 'practice_layout',
			code: data,
			myName: name,
			pairName:name,
			mode: 'practice'
		});
	});
}

module.exports = doPractice;
