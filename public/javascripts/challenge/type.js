
var typedLetters = 0;

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
				updateLetterCount()
       		} else {
       			$(".me span.typing").removeClass("typing").addClass("wrong");
       			$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");  
       		}
       	}
 
	}

	if ($(".me span.typing").hasClass("hidden"))
		$(".me span.typing").removeClass("hidden");
	if ($(".me span.hasTyped:last").hasClass("hiddenElement"))
		$(".me span.hasTyped:last").addClass("hidden");
	if ((!$(".me span").hasClass("typing"))&&(!$(".me span").hasClass("wrong"))){
		finish(true);
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
				updateLetterCount()
			}
    	   	e.keyCode = 0; 
    	   	e.returnValue = false;
    	   	break;
       	case 13:
			
     		if ($(".me span").hasClass("wrong")) {   			   	
    	   		$(".me span.typing").removeClass("typing").addClass("wrong");
    	   		$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");    	     	   	    	   	
       	} else {
       		if ($(".me span.typing").hasClass("return")) {
       			$(".me span.typing").removeClass("typing").addClass("hasTyped");
       			$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");
				sendUpdate({key:-1});
				typedLetters++;
				updateLetterCount()
       		} else {
       			$(".me span.typing").removeClass("typing").addClass("wrong");
       			$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");  
       		}
       	}
    	   break;
       case 32:
			
      		if ($(".me span").hasClass("wrong")) {   			   	
    	   		$(".me span.typing").removeClass("typing").addClass("wrong");
    	   		$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");    	     	   	    	   	
       		} else {
       			if ($(".me span.typing").html()=="&nbsp;") {
       				$(".me span.typing").removeClass("typing").addClass("hasTyped");
       				$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");
					sendUpdate({key:-1});
					typedLetters++;
					updateLetterCount()
       			} else {
       				$(".me span.typing").removeClass("typing").addClass("wrong");
       				$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");  
       			}
       		}
			
			e.keyCode = 0; 
    	   	e.returnValue = false;
       		return false;
       		break;

       default :  break;
       }
 
   }
}




