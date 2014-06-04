
/* GET home page. */
function doIndex(req, res, onlineNum) {
	if (req.session && req.session.name) {
		res.render('index', { 
			title: 'Express',
			layout: 'general_layout',
			name: req.session.name,	
			onlineNum: onlineNum
		});
	}else {
		res.render('index', { 
			title: 'Express',
			layout: 'general_layout',
			name: '',
			onlineNum: onlineNum
		});
	}

}

module.exports = doIndex;
