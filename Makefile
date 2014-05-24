start:
	mongod --dbpath ~/Programs/mongodb/data/db &
	node app.js &

kill:
	killall mongod
	killall node

