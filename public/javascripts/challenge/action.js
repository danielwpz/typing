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
		// change the look of 'Play Again' button
		$('#play_again_btn').addClass('disabled');
		$('#play_again_btn').text('Waiting...');
		if (evet == 'Practice') {
			shouldRefresh = true;
			refresh();
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
	var rrShareParam = {
		resourceUrl : 'http://coderush.duapp.com',	//分享的资源Url
		srcUrl : 'http://coderush.duapp.com',	//分享的资源来源Url,默认为header中的Referer,如果分享失败可以调整此值为resourceUrl试试
		pic : 'http://112.124.112.14/image/logo.png',		//分享的主题图片Url
		title : 'CodeRush代码竞速游戏',		//分享的标题
		description : '我的代码速度是 '+typeSpeed+' lpm，快来和我比试吧！'	//分享的详细描述
	};
	rrShareOnclick(rrShareParam);
}

//back to homepage after game
function back() {
	var hostPath = window.location.hostname;
	var hostPort = window.location.port;
	// do redirection
	window.location.assign('http://' + hostPath + ':' + hostPort);
}
