var wrongTimes = 0;
var typedLetters = 0;

var sound = 0;
var sound2 = 0;
function playSound() {
	sound++;
	document.getElementById("sound"+sound%4).play();
}
function playSound2() {
	sound2++;
	document.getElementById("return"+sound2%4).play();
}

function keypress(e)
{

	var currKey=0,CapsLock=0,e=e||event;
	currKey=e.keyCode||e.which||e.charCode;

	var letter = $(".me span.typing").text();
	
	switch (currKey)
	{
	//屏蔽了退格、空格、回车
	case 8: case 32: case 13:break;
	
   	default:
		playSound();
   		var k = String.fromCharCode(currKey);
   		if ($(".me span").hasClass("wrong")) {   			   	
    	   		$(".me span.typing").removeClass("typing").addClass("wrong");
    	   		$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");   	     	   	    	   	
       	} else {
       		if (k==letter) {
       			$(".me span.typing").removeClass("typing").addClass("hasTyped");
       			$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");
				sendUpdate({key:-1});
				typedLetters++;
				updateLetterCount();
       		} else {
       			$(".me span.typing").removeClass("typing").addClass("wrong");
       			$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");  
				wrongTimes++; 
				updateWrongCount();
       		}
       	}
		statusCheck();
	}
}

function keydown(e)
{
   	var e = e||event;
   	var currKey = e.keyCode||e.which||e.charCode;
	if (e.ctrlKey)
		window.scrollBy(0,100);
   	if ((currKey>7&&currKey<14)||(currKey>31&&currKey<47))
   	{
		
       	switch (currKey)
       	{
       	case 8: 
			playSound();
    	   	if ($(".me span").hasClass("wrong")) {
				if ($(".me span.typing").hasClass("hiddenElement"))
					$(".me span.typing").addClass("hidden");
    		   	$(".me span.typing").removeClass("typing").addClass("notTyped");
    		   	$(".me span.wrong:last").removeClass("wrong").addClass("typing");
    	   	} else if ($(".me span").hasClass("hasTyped")){
				if ($(".me span.typing").hasClass("hiddenElement"))
					$(".me span.typing").addClass("hidden");
    		   	$(".me span.typing").removeClass("typing").addClass("notTyped");
    		   	$(".me span.hasTyped:last").removeClass("hasTyped").addClass("typing");
				sendUpdate({key:-2});
				typedLetters--;
				updateLetterCount();
			}
    	   	e.keyCode = 0; 
    	   	e.returnValue = false;
			statusCheck();
			return false;
    	   	break;
       	case 13:
			playSound2();
     		if ($(".me span").hasClass("wrong")) {   			   	
    	   		$(".me span.typing").removeClass("typing").addClass("wrong");
    	   		$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");     	     	   	    	   	
       		} else {
       			if ($(".me span.typing").hasClass("return")) {
       				$(".me span.typing").removeClass("typing").addClass("hasTyped");
       				$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");
					sendUpdate({key:-1});
					typedLetters++;
					updateLetterCount();
       			} else {
       				$(".me span.typing").removeClass("typing").addClass("wrong");
       				$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");  
					wrongTimes++; 
					updateWrongCount();
       			}
       		}
			e.keyCode = 0; 
    	   	e.returnValue = false;
			statusCheck();
			return false;
    	   	break;
       case 32:
			playSound2();
      		if ($(".me span").hasClass("wrong")) {   			   	
    	   		$(".me span.typing").removeClass("typing").addClass("wrong");
    	   		$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");    	     	   	    	   	
       		} else {
       			if ($(".me span.typing").html()=="&nbsp;") {
       				$(".me span.typing").removeClass("typing").addClass("hasTyped");
       				$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");
					sendUpdate({key:-1});
					typedLetters++;
					updateLetterCount();
       			} else {
       				$(".me span.typing").removeClass("typing").addClass("wrong");
       				$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");  
					wrongTimes++; 
					updateWrongCount();
       			}
       		}
			
			e.keyCode = 0; 
    	   	e.returnValue = false;
			statusCheck();
       		return false;
       		break;

       default :  break;
       }
 
   }
}

function statusCheck() {
	if ($(".me span.typing").hasClass("hidden")) {
		$(".me span.typing").removeClass("hidden");
	}
	if ($(".me span.hasTyped:last").hasClass("hiddenElement")) {
		$(".me span.hasTyped:last").addClass("hidden");
	}
	if ((!$(".me span").hasClass("typing"))&&(!$(".me span").hasClass("wrong"))){
		finish(true);
	}
}




