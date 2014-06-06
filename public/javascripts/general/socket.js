function registerListeners(so) {
	so.on('_Reply', function(data) {
		if (data.type == 'Register') {
			var result = data.result;
			var nameErr = '';
			console.log(data);

			if (result == 'ok') {
				console.log('Register successfully!\n');
				$('#registeModal').modal('toggle');
				// refresh the page
				var hostPath = window.location.hostname;
				var hostPort = window.location.port;
				window.location.assign('http://' + hostPath + ':' + hostPort);
			}else if (result == 'exist') {
				nameErr = 'Username exists.';
			}else {
				nameErr = 'Uppose, something wrong happened.';
			}

			// show error promot
			$('#register_name_err').text(nameErr);

		}else if (data.type == 'SignIn') {
			console.log('Sign In:' + data.result + '\n');
			if (data.result == 'ok') {
				console.log('Sign In OK.\n');
				// refresh the page
				var hostPath = window.location.hostname;
				var hostPort = window.location.port;
				window.location.assign('http://' + hostPath + ':' + hostPort);
			}else {
				$('#signin-name').addClass('error_input');
				$('#signin-pwd').addClass('error_input');
			}
		}
	});

	so.on('_Reply', function(data) {
		if (data.type == 'Challenge') {
			var result = data.result;
			var errDes = '';
			console.log(data);

			if (result == 'start') {
				// redirect to given location
				var path = data.page;
				var hostPath = window.location.hostname;
				var hostPort = window.location.port;
				window.location.assign('http://' + hostPath + ':' + hostPort + path);

				return;
			}else if (result == 'not-online') {
				errDes = 'Opponent is not online.';
			}else if (result == 'racing') {
				errDes = 'Opponent is being racing.';
			}else if (result == 'nonavail') {
				errDes = 'Opponent is unavailable.';
			}

			$('#challenge_pair_err').text(errDes);
			makeAble('#challenge_btn', 'Challenge');
		}
	});

	so.on('_Reply', function(data) {
		if (data.type == 'Match') {
			console.log('Match: ' + data.result + '\n');
		}
	});

	so.on('_Challenge', function(data) {
		var name = data.name;

		// show messenger
		if (data.type == 'try') {
		var msg = Messenger().post({
			message: '"' + name + 
				'" challenge you on language ' + 
				data.lan + '.',
			type: 'info',
			id: name,
			singleton: false,
			hideAfter: 100,
			actions: {
					accept: {
						label: 'Accept',
						action: function() {
						var spinhtml = '<i class="icon-spinner icon-spin"></i>';
						var sendData = {
							type: 'try', 
							name: name,
							lan: data.lan
						};
						// store data in local for reuse
						sessionStorage.setItem('last_evt', 'Challenge');
						sessionStorage.setItem('last_data', JSON.stringify(sendData));
						// tell server the result
						so.emit('Challenge', sendData);
						return msg.update({
							message: spinhtml + ' Waiting for begining...',
							   type: 'success',
							   hideAfter: 100,
							   actions: false
						});
				}
					},
				reject: {
					label: 'reject',
					action: function() {
						// tell server the result
						so.emit('Challenge', {type: 'reject', name: name});
						return msg.update({
							message: 'Rejected.',
							   type: 'error',
							   actions: false
						});
					}
				}
			}
		});
		}else if (data.type == 'cancel') {
			Messenger().post({
				message: "'" + name + "' canceled challenge.",
				type: 'info',
				id: name,
				showCloseButton: true,
				singleton: false
			});
		}
	});

	so.on('disconnect', function() {
		so.disconnect();
	});
}


