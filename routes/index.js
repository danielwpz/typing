
/* GET home page. */
function doIndex(req, res) {
	if (req.session && req.session.name) {
		res.render('index', { 
			title: 'Express',
			layout: 'general_layout',
			name: req.session.name	
		});
	}else {
		res.render('index', { 
			title: 'Express',
			layout: 'general_layout',
			name: ''
		});
	}

}

module.exports = doIndex;
