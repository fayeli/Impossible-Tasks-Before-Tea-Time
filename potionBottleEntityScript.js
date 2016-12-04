//
//  potionBottleEntityScript.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
	var potionToMainChannel = "Potion-To-Main-Channel";
	function showDrinkingFx () {
		print("show drinking fx");
		//TODO: Particle fx

		//TODO: Audio fx
	}

	function enableGestureRecognizer () {
		print("enable Gesture Recognizer");
		Messages.sendMessage(potionToMainChannel, MyAvatar.sessionUUID);
	}

	this.startNearGrab = function(entityId) {
		showDrinkingFx();
        enableGestureRecogniser();
	};

	this.clickReleaseOnEntity = function(entityID, mouseEvent) {
        if (!mouseEvent.isLeftButton) {
            return;
        }
        showDrinkingFx();
        enableGestureRecognizer();
    }
});