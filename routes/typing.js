var levelManager = require('../modules/LevelManager.js');


/* GET users listing. */
function doTyping(req, res, myName, pairName) {
	var lan = req.params.lan;
	var path = './levels/' + lan + '/';
	levelManager({levelPath: path}, function(err, data) {
		if (err) {
			console.log('levelmanager err:' + err);
		}else {
			console.log('render typing for ' + myName);
			res.set('Cache-Control', 'no-cache');			
			res.render('typing', {
				title: 'Challenge',
				layout: 'challenge_layout',
				code: data,
				mode: 'challenge',
				myName: myName,
				pairName: pairName
			});
		}
	});
}

module.exports = doTyping;
