function challenge() {
	var pair = $('#pair-name-input').val();

	socket.emit('Challenge', {type: 'try', name: pair});
}

function tryAgain() {
	var evet = sessionStorage.getItem('last_evt');
	var data = sessionStorage.getItem('last_data');

	if (data && evet) {
		var indexSocket = io.connect(socketUrl);

		if (indexSocket) {
			registerIndexListeners(indexSocket);

			indexSocket.emit(evet, data);
		}
	}
}
