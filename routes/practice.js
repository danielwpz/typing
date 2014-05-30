function doPractice(req, res) {
	var name = null;
	if (req.session && req.session.name) {
		name = req.session;
	}

	res.render('typing', {
		title: 'Practice',
		layout: 'practice_layout',
		myName: name,
		mode: 'practice'
	});
}

module.exports = doPractice;
