function registerListeners(so) {
	so.on('_Reply', function(data) {
		console.log('[C]Reply:' + data.type + '\n');
		if (data.type == 'Redir') {
			var path = data.page;
			var hostPath = window.location.hostname;
			var hostPort = window.location.port;
			// do redirection
			window.location.assign('http://' + hostPath + ':' +
				hostPort + path);
		}else if (data.type == 'Challenge') {
			if (data.result == 'start') {
				var path = data.page;
				var hostPath = window.location.hostname;
				var hostPort = window.location.port;
				// redirect to given location
				window.location.assign('http://' + hostPath + ':' + hostPort + path);
			}
			console.log('Result:' + data.result);
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

function registerIndexListeners(so) {
	so.on('_Reply', function(data) {
		console.log('[/]Reply:' + data.type + '\n');
		if (data.type == 'Challenge') {
			console.log(data);
			if (data.result == 'start') {
				var path = data.page;
				var hostPath = window.location.hostname;
				var hostPort = window.location.port;
				// redirect to given location
				window.location.assign('http://' + hostPath + ':' + hostPort + path);
			}
		}
	});

	so.on('_Reply', function(data) {
		if (data.type == 'Match') {
			console.log('Match: ' + data.result + '\n');
		}
	});
}

function sendUpdate(data) {
	socket.emit('Update', data);
}

function sendFinish(data) {
	socket.emit('Finish', data);
}
