function MatchPicker() {
	var waitList = {};

	this.match = function(name, options) {
		// get the wait list for specific language
		var thisWaitList = waitList[options.lan];
		
		if (thisWaitList == undefined || thisWaitList == null) {
			waitList[options.lan] = name;
			return "";
		}else {
			var pairName = thisWaitList;
			thisWaitList = null;

			return pairName;
		}
	}

	this.clear = function(name) {
		var subList;
		for (subList in waitList) {
			if (subList == name) {
				subList = [];
			}
		}
	}
}

module.exports = MatchPicker;

