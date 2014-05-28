start:
	mongod --nojournal --dbpath /home/daniel/Programs/mongodb/data/db >/dev/null 2>&1 &
	node app.js &

kill:
	-killall mongod
	-killall node

