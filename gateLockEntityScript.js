//
//  gateLockEntityScript.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
	var gateLockToMainChannel = "Gate-Lock-To-Main-Channel";
	var utilitiesScript = Script.resolvePath('http://hifi-content.s3.amazonaws.com/james/tracklight/utils.js');
    Script.include(utilitiesScript);

	function unlockGate() {
		print("gate lock sending message");
		Messages.sendMessage(gateLockToMainChannel, "pls unlock gate");
	}

	this.preload = function(entityID) {
		setEntityCustomData('grabbableKey', entityID, {
                wantsTrigger: true
        });
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