start:
	mongod --nojournal --dbpath /home/daniel/programs/data/db &
	supervisor app.js  &

kill:
	-killall mongod
	-killall node

