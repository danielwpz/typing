var index = 0;
//displayed in finish modal 
var timeString;
var time;
var gameResult;


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
		$('#gameLoad').addClass('hidden');
		$('#gameStart').removeClass('hidden');
		document.onkeypress=keypress;
		document.onkeydown=keydown;
		sendUpdate({key:-4});
		start = true;
	}
}

function finish(win) {
	var today=new Date();
	var wrongRate = new Number(wrongTimes/typedLetters*100);
	time = (((today.getHours()-h)*60+(today.getMinutes()-m))*60+(today.getSeconds()-s))*1000+today.getMilliseconds()-ms;
	var typeSpeed = Math.floor(typedLetters/time*1000*60);
	sendFinish({time:time,typedLetters:typedLetters,speed:typeSpeed,wrongTimes:wrongTimes});
	document.onkeypress=null;
	document.onkeydown=null;
	clearTimeout(t);
	timeString = document.getElementById('time').innerHTML;
	$('#timeString').html(timeString);
	$('#speed').html(typeSpeed);
	if(typedLetters==0) {
		$('#wrongHits').html("0%");
	} else {
		$('#wrongHits').html(wrongRate.toFixed(1)+"%");
	}

	if(win) {
		sendUpdate({key:-3});
		$('#myModalLabel').html("You win!");
		$('#finishModal').modal('show');
		//alert("win "+time);
	} else {
		$('#myModalLabel').html("You lose!");
		$('#finishModal').modal('show');
		//alert("lose "+time);
	}
	
	start = false;
}

function doFinish(data) {
	finish(false);
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
	//document.getElementById('letter-count').innerHTML=typedLetters;
	//var totalLetters = parseInt(document.getElementById('total').innerHtml);
	//var w1 = Math.round(typedLetters/totalLetters*100) + "%";
	//document.getElementById('prog').style.width = w1;
}

function updateWrongCount() {
	document.getElementById('wrong').innerHTML=wrongTimes;
}
