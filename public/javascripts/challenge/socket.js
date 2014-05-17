function registerListeners(so) {
	so.on('_Reply', function(data) {
		if (data.type == 'Redir') {
			var path = data.page;
			var hostPath = window.location.hostname;
			var hostPort = window.location.port;
			// do redirection
			window.location.assign('http://' + hostPath + ':' +
				hostPort + path);
		}
	});

	so.on('_Start', function(data) {
		console.log('start!');
	});

	so.on('_Update', function(data) {
		console.log('Update: ' + data);
		doUpdate(data);
	});
}

function doUpdate(data) {
	switch (data)
	{
	//屏蔽了退格、制表、回车、空格、方向键、删除键
	case 8: case 32: case 13://case 9:case 13:case 37:case 38:case 39:case 40:case 46:
	handleSpeChars(data);
    break;
	
   	default:
   //		alert(currKey);
   //		alert(String.fromCharCode(currKey));
   		var k = String.fromCharCode(currKey);
   		if ($(".opponent span").hasClass("wrong")) {   			   	
    	   		$(".opponent span.typing").removeClass("typing").addClass("wrong");
    	   		$(".opponent span.notTyped:first").removeClass("notTyped").addClass("typing");    	     	   	    	   	
       	} else {
       		if (k==letter) {
       			$(".opponent span.typing").removeClass("typing").addClass("hasTyped");
       			$(".opponent span.notTyped:first").removeClass("notTyped").addClass("typing");
       		} else {
       			$(".opponent span.typing").removeClass("typing").addClass("wrong");
       			$(".opponent span.notTyped:first").removeClass("notTyped").addClass("typing");  
       		}
       	}
 
	}

	if ($(".opponent span.typing").hasClass("hidden"))
		$(".opponent span.typing").removeClass("hidden");
	if ($(".opponent span.hasTyped:last").hasClass("hiddenElement"))
		$(".opponent span.hasTyped:last").addClass("hidden");

}

function handleSpeChars(data) {
	if ((data>7&&data<14)||(data>31&&data<47))
   	{
       	switch (data)
       	{
       	case 8: 
    	   	if ($(".opponent span").hasClass("wrong")) {
				if ($(".opponent span.typing").hasClass("hiddenElement"))
					$(".opponent span.typing").addClass("hidden");
    		   	$(".opponent span.typing").removeClass("typing").addClass("notTyped");
    		   	$(".opponent span.wrong:last").removeClass("wrong").addClass("typing");
    	   	} else if ($(".opponent span").hasClass("hasTyped")){
    		   	$(".opponent span.typing").removeClass("typing").addClass("notTyped");
    		   	$(".opponent span.hasTyped:last").removeClass("hasTyped").addClass("typing");
			}
    	   	break;
       	case 13:
     		if ($(".opponent span").hasClass("wrong")) {   			   	
    	   		$(".opponent span.typing").removeClass("typing").addClass("wrong");
    	   		$(".opponent span.notTyped:first").removeClass("notTyped").addClass("typing");    	     	   	    	   	
       	} else {
       		if ($(".opponent span.typing").hasClass("return")) {
       			$(".opponent span.typing").removeClass("typing").addClass("hasTyped");
       			$(".opponent span.notTyped:first").removeClass("notTyped").addClass("typing");
       		} else {
       			$(".opponent span.typing").removeClass("typing").addClass("wrong");
       			$(".opponent span.notTyped:first").removeClass("notTyped").addClass("typing");  
       		}
       	}
    	   break;
       case 32:
      		if ($(".opponent span").hasClass("wrong")) {   			   	
    	   		$(".opponent span.typing").removeClass("typing").addClass("wrong");
    	   		$(".opponent span.notTyped:first").removeClass("notTyped").addClass("typing");    	     	   	    	   	
       		} else {
       			if ($(".opponent span.typing").html()=="&nbsp;") {
       				$(".opponent span.typing").removeClass("typing").addClass("hasTyped");
       				$(".opponent span.notTyped:first").removeClass("notTyped").addClass("typing");
       			} else {
       				$(".opponent span.typing").removeClass("typing").addClass("wrong");
       				$(".opponent span.notTyped:first").removeClass("notTyped").addClass("typing");  
       			}
       		}
       
       		break;

       default :  break;
       }
 
   }
}
function sendUpdate(data) {
	socket.volatile.emit('Update', data);
}
