function registerListeners(so) {
	so.on('_Start', function(data) {
		console.log('start!');
	});

	so.on('_Update', function(data) {
		console.log('Update: ' + data);
		doUpdate(data);
}

function sendUpdate(data) {
	socket.volatile.emit('Update', data);
}
