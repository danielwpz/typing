function registerListeners(so) {
	so.on('_Reply', function(data) {
		if (data.type == 'Redir') {
			var path = data.page;
			var hostPath = window.location.hostname;
			var hostPort = window.location.port;
			// do redirection
			window.location.assign('http://' + hostPath + ':' +
				hostPort + path);
		}
	});

	so.on('_Start', function(data) {
		console.log('start!');
	});

	so.on('_Update', function(data) {
		console.log('Update: ' + data);
		doUpdate(data);
	});
}

function doUpdate(data) {
}

function sendUpdate(data) {
	socket.volatile.emit('Update', data);
}
