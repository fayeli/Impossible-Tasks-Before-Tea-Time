//
//  escapeTheElevatorMain.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
	var leverToMainChannel = "Lever-To-Main-Channel";
    var mainToLeverChannel = "Main-To-Lever-Channel";
    var leverAreaToMainChannel = "Lever-Area-To-Main-Channel";

    print("running esacape the elevator main");


	var handleMessages = function(channel, message, sender) {
        if (channel === leverToMainChannel) {
            // on lever toggle
            print("main recieved message from lever: " + message);

            //TODO: key magically appears 

            // if (message.hasOwnProperty("selfieCamEntityID")) { 
            //     SELFIECAMERA_ID = message.selfieCamEntityID;
            // }
            // if (message.hasOwnProperty("equipped")) { 
            //     equippedCamera = message.equipped;
            // }
        }
        if (channel === leverAreaToMainChannel) {
            // on a person leaving the lever area, the lever flips back and the gate locks up
            print("main recieved message from lever area: " + message);
            Messages.sendMessage(mainToLeverChannel, "toggle lever up");
        }
    };
    
    Messages.subscribe(leverToMainChannel);
    Messages.subscribe(leverAreaToMainChannel);
    Messages.messageReceived.connect(handleMessages);

	function cleanup() {
        print("escape the elevator main cleanup");
        Messages.unsubscribe(leverToMainChannel);
        Messages.unsubscribe(leverAreaToMainChannel);
        Messages.messageReceived.disconnect(handleMessages);
    }

	Script.scriptEnding.connect(cleanup);
}());