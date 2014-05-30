var index = 0;
//displayed in finish modal 
var contestResult = false;
var timeString;
var time;


function doUpdate(data) {
	
	if (data.key==-1) {
		index++;
		$(".me span.o-typing").removeClass("o-typing").addClass("o-hasTyped");
       	$(".me span.o-notTyped:first").removeClass("o-notTyped").addClass("o-typing");
	} else if (data.key==-2){
		index--;
 		$(".me span.o-typing").removeClass("o-typing").addClass("o-notTyped");
    	$(".me span.o-hasTyped:last").removeClass("o-hasTyped").addClass("o-typing");
	} else if (data.key==-3) {
		finish(false);
	} else if (data.key==-4) {
		while (index>0) {
			index--;
 			$(".me span.o-typing").removeClass("o-typing").addClass("o-notTyped");
    		$(".me span.o-hasTyped:last").removeClass("o-hasTyped").addClass("o-typing");
		}
		sendUpdate({key:typedLetters});
	} else if (data.key>0) {
		while (data.key>0) {
			data.key--;
 			$(".me span.o-typing").removeClass("o-typing").addClass("o-hasTyped");
       		$(".me span.o-notTyped:first").removeClass("o-notTyped").addClass("o-typing");
		}
	}
}



var c=0;
var h;
var m;
var s;
var ms;
var t;

function startTime() {
c = c+1;
var hour= Math.floor(c/3600);
var minute=Math.floor(c/60)-hour*60;
minute = checkTime(minute);
var sec = c % 60;
sec = checkTime(sec);
document.getElementById('time').innerHTML=hour+":"+minute+":"+sec;
t=setTimeout('startTime()',1000)
}

var start = false;
function doStart() {
	if(!start){
	var today=new Date();
	h=today.getHours();
	m=today.getMinutes();
	s=today.getSeconds();
	ms=today.getMilliseconds();
	startTime();
	document.onkeypress=keypress;
	document.onkeydown=keydown;
	sendUpdate({key:-4});
	start = true;
	}
}

function finish(win) {
	var today=new Date();
	time = (((today.getHours()-h)*60+(today.getMinutes()-m))*60+(today.getSeconds()-s))*1000+today.getMilliseconds()-ms;
	sendFinish({time: time});
	document.onkeypress=null;
	document.onkeydown=null;
	clearTimeout(t);
	timeString = document.getElementById('time').innerHTML;
	if(win) {
		sendUpdate({key:-3});
		contestResult = true;
		$('#finishModal').modal('show');
		alert("win "+time);
	} else {
		contestResult = false;
		$('#finishModal').modal('show');
		alert("lose "+time);
	}
	
	start = false;
}

function doFinish(data) {
}

function checkTime(i)
{
if (i<10) 
  {i="0" + i}
  return i
}

function updateLetterCount() {
	document.getElementById('letter-count').innerHTML=typedLetters;
	document.getElementById('prog').value = typedLetters;
}

function updateWrongCount() {
	document.getElementById('wrong').innerHTML=wrongTimes;
}
