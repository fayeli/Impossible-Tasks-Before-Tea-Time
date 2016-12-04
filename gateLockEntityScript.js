//
//  gateLockEntityScript.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
	var gateLockToMainChannel = "Gate-Lock-To-Main-Channel";

	function unlockGate() {
		print("gate lock sending message");
		Messages.sendMessage(gateLockToMainChannel, "pls unlock gate");
	}

	this.clickReleaseOnEntity = function(entityID, mouseEvent) {
        if (!mouseEvent.isLeftButton) {
            return;
        }
        unlockGate();
    };

    this.startNearTrigger = function() {
        unlockGate();
    };
});