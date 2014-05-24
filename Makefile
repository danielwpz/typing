start:
	mongod --nojournal --dbpath /home/daniel/Programs/mongodb/data/db &
	node app.js &

kill:
	-killall mongod
	-killall node

