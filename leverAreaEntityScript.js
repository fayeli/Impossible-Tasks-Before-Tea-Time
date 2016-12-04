//
//  leverAreaEntityScript.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
	var leverAreaToMainChannel = "Lever-Area-To-Main-Channel";
	this.enterEntity = function(entityID) {
		print("enter lever area entity");
	};
	this.leaveEntity = function(entityID) {
		print("leave lever area entity");
		var message = "yay";
		Messages.sendMessage(leverAreaToMainChannel, message);
	};
});