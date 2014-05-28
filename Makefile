start:
	mongod --nojournal --dbpath /home/daniel/programs/data/db &
	node app.js &

kill:
	-killall mongod
	-killall node

