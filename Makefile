start:

	mongod --nojournal --dbpath /home/flossie/db &
	node app.js &

kill:
	-killall mongod
	-killall node

