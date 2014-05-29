start:
	export LC_ALL=C
	mongod --nojournal --dbpath /home/daniel/programs/data/db >/dev/null 2>&1 &
	supervisor app.js >/dev/null 2>&1 &

kill:
	-killall mongod
	-killall node

