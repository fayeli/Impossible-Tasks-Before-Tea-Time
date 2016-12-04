//
//  potionBottleEntityScript.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
	function showDrinkingFx () {
		print("show drinking fx");
		//TODO: Particle fx

		//TODO: Audio fx
	}

	function enableGestureRecognizer () {
		print("enable Gesture Recognizer");
		Settings.setValue("hackathon-spell-enabled", true);
	}

	this.preload = function(entityID) {
		Settings.setValue("hackathon-spell-enabled", false);
	};

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