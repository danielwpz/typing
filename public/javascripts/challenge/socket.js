function registerListeners(so) {
	so.on('_Reply', function(data) {
		console.log(data + '\n');
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
		doStart();
	});

	so.on('_Update', function(data) {
		console.log('Update: ' + data);
		doUpdate(data);
	});
}

function doUpdate(data) {
	console.log('Update: ' + data.cnt + '\n');
}

function sendUpdate(data) {
	socket.emit('Update', data);
}

function sendFinish(data) {
	socket.emit('Finish', data);
}

