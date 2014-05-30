function registerListeners(so) {
	so.on('_Reply', function(data) {
		if (data.type == 'Register') {
			if (data.result == 'ok') {
				console.log('Register successfully!\n');
				$('#registeModal').modal('toggle');
				// refresh the page
				var hostPath = window.location.hostname;
				var hostPort = window.location.port;
				window.location.assign('http://' + hostPath + ':' + hostPort);
			}else {
				console.log(data);
			}
		}else if (data.type == 'SignIn') {
			console.log('Sign In:' + data.result + '\n');
			if (data.result == 'ok') {
				console.log('Sign In OK.\n');
				// refresh the page
				var hostPath = window.location.hostname;
				var hostPort = window.location.port;
				window.location.assign('http://' + hostPath + ':' + hostPort);

			}
		}
	});

	so.on('_Reply', function(data) {
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

	so.on('_Challenge', function(data) {
		var name = data.name;

		// show messenger
		var msg = Messenger().post({
			message: '"' + name + 
				'" challenge you on language ' + 
				data.lan + '.',
			type: 'info',
			hideAfter: 100,
			actions: {
				accept: {
					label: 'Accept',
			action: function() {
				var spinhtml = '<i class="icon-spinner icon-spin"></i>';
				// tell server the result
				so.emit('Challenge', {
					type: 'try', 
					name: name,
					lan: data.lan
				});
				// store data in local for reuse
				sessionStorage.setItem('last_evt', 'Challenge');
				sessionStorage.setItem('last_data', data);
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
	});

	so.on('disconnect', function() {
		so.disconnect();
	});
}


