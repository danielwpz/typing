<!DOCTYPE html>
<html>
	<head>
	<script src="javascripts/socket.io/socket.io.min.js"></script>
		<script>
			var socket = io.connect('http://localhost:8080');
			socket.on('to_pair', function(data) {
					console.log(data);
			});
			socket.on('message', function(data) {
					console.log(data);
					});

			function send() {
				socket.emit('from_pair', 'Send msg.\n');
			}
		</script>
	</head>

	<body>
		<a onclick="send()">send</a>
	</body>

</html>
