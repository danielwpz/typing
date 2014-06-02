function challenge() {
	var pair = $('#pair-name-input').val();

	socket.emit('Challenge', {type: 'try', name: pair});
}

function tryAgain() {
	var evet = sessionStorage.getItem('last_evt');
	var dataStr = sessionStorage.getItem('last_data');
	var data = JSON.parse(dataStr);

	console.log('last_evt:' + evet + ', last_data:\n');
	console.log(data);

	if (data && evet) {
		var indexSocket = io.connect(socketUrl);

		if (indexSocket) {
			registerIndexListeners(indexSocket);

			indexSocket.emit(evet, data);
		}
	}
}

function share() {

}
//back to homepage after game
function back() {

}

function playAgain() {

}
