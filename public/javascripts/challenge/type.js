

function keypress(e)
{
	var currKey=0,CapsLock=0,e=e||event;
	currKey=e.keyCode||e.which||e.charCode;
	//CapsLock=currKey>=65&&currKey<=90;
	var letter = $(".me span.typing").text();
	sendUpdate(currKey);
	switch (currKey)
	{
	//屏蔽了退格、制表、回车、空格、方向键、删除键
	case 8: case 32: case 13://case 9:case 13:case 37:case 38:case 39:case 40:case 46:
	
           	break;
	
   	default:
   //		alert(currKey);
   //		alert(String.fromCharCode(currKey));
   		var k = String.fromCharCode(currKey);
   		if ($(".me span").hasClass("wrong")) {   			   	
    	   		$(".me span.typing").removeClass("typing").addClass("wrong");
    	   		$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");    	     	   	    	   	
       	} else {
       		if (k==letter) {
       			$(".me span.typing").removeClass("typing").addClass("hasTyped");
       			$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");
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

}

function keydown(e)
{
   	var e = e||event;
   	var currKey = e.keyCode||e.which||e.charCode;
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
    		   	$(".me span.typing").removeClass("typing").addClass("notTyped");
    		   	$(".me span.hasTyped:last").removeClass("hasTyped").addClass("typing");
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
       			} else {
       				$(".me span.typing").removeClass("typing").addClass("wrong");
       				$(".me span.notTyped:first").removeClass("notTyped").addClass("typing");  
       			}
       		}
			e.keyCode = 0; 
    	   	e.returnValue = false;
       
       		break;

       default :  break;
       }
 
   }
}


document.onkeypress=keypress;
document.onkeydown=keydown;

