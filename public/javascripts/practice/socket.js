function registerListeners(so) {
	so.on('_Reply', function(data) {
		console.log('Reply:' + data.type + '\n');
		if (data.type == 'Redir') {
			var path = data.page;
			var hostPath = window.location.hostname;
			var hostPort = window.location.port;
			// do redirection
			window.location.assign('http://' + hostPath + ':' +
				hostPort + path);
		}
	});
}

function sendFinish(data) {
	socket.emit('Finish', data);
}

