function MatchPicker() {
	var waitList = {};

	this.match = function(name, options) {
		// get the wait list for specific language
		var thisWaitList = waitList[options.lan];
		
		if (thisWaitList == undefined || thisWaitList == null ||
				thisWaitList.length == 0) {
			waitList[options.lan] = [name];
			return "";
		}else {
			var pairName = thisWaitList[0];
			thisWaitList = [];

			return pairName;
		}
	}

	this.clear = function(name) {
		var subList;
		for (subList in waitList) {
			if (subList[0] == name) {
				subList = [];
			}
		}
	}
}

module.exports = MatchPicker;

