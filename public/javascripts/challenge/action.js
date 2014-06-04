function init() {
	shouldRefresh = true;

	setTimeout('refresh()', 3000);
}

function deinit() {
	shouldRefresh = false;
}

function refresh() {
	if (shouldRefresh) {
		window.location.reload(true);
		window.location.href = window.location.href;
	}
}


function challenge() {
	var pair = $('#pair-name-input').val();

	socket.emit('Challenge', {type: 'try', name: pair});
}

function tryAgain() {
	var evet = sessionStorage.getItem('last_evt');
	var dataStr = sessionStorage.getItem('last_data');

	console.log('last_evt:' + evet + ', last_data:' + dataStr);
	if (dataStr && evet) {
		if (evet == 'Practice') {
			window.location.reload(true);
			window.location.href = window.location.href;
		}else {
			var data = JSON.parse(dataStr);
			var indexSocket = io.connect(socketUrl);

			if (indexSocket) {
				registerIndexListeners(indexSocket);

				indexSocket.emit(evet, data);
			}
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
