var index = 0;
//displayed in finish modal 
var timeString;
var time;
var gameResult;

var typeSpeed;



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
		$('#gameLoad').addClass('hidden');
		$('#gameStart').removeClass('hidden');
		document.onkeypress=keypress;
		document.onkeydown=keydown;
		start = true;
	}
}

function finish() {
	var today=new Date();
	var wrongRate = new Number(wrongTimes/typedLetters*100);
	time = (((today.getHours()-h)*60+(today.getMinutes()-m))*60+(today.getSeconds()-s))*1000+today.getMilliseconds()-ms;
	typeSpeed = Math.floor(typedLetters/time*1000*60);
	sendFinish({time:time,typedLetters:typedLetters,speed:typeSpeed,wrongTimes:wrongTimes});
	document.onkeypress=null;
	document.onkeydown=null;
	clearTimeout(t);
	timeString = document.getElementById('time').innerHTML;
	$('#timeString').html(timeString);
	$('#speed').html(Math.floor(typedLetters/time*1000*60));
	if(typedLetters==0) {
		$('#wrongHits').html("0%");
	} else {
		$('#wrongHits').html(wrongRate.toFixed(1)+"%");
	}

	$('#myModalLabel').html("Completed!");
	$('#finishModal').modal('show');
	//alert("win "+time);

	
	start = false;
}

function doFinish(data) {
	finish();
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
