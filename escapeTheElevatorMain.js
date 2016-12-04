//
//  escapeTheElevatorMain.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
    var potionToMainChannel = "Potion-To-Main-Channel";
	var leverToMainChannel = "Lever-To-Main-Channel";
    var mainToLeverChannel = "Main-To-Lever-Channel";
    var leverAreaToMainChannel = "Lever-Area-To-Main-Channel";
    var gateLeftID, gateRightID;
    var GATE_OPEN_ANGLE_IN_RADIANS = 0.872665;

    main();

    function main() {
        print("running esacape the elevator main");
        Messages.subscribe(potionToMainChannel);
        Messages.subscribe(leverToMainChannel);
        Messages.subscribe(leverAreaToMainChannel);
        Messages.messageReceived.connect(handleMessages);

        searchForEntities();
        unlockGate();
    };

    function searchForEntities() {
        var entities = Entities.findEntities(MyAvatar.position, 100);
        entities.forEach(function(id){
            var props = Entities.getEntityProperties(id);
            if (props.name === "Gate_door_R") {
                gateRightID = id;
            } else if (props.name === "Gate_door_L") {
                gateLeftID = id;
            }
        });
        print("gateLeftID: " + gateLeftID + ", gateRightID: " + gateRightID);
    }

    function givePlayerMagic(playerUUID) {
        print("give player magic, playerUUID = " + playerUUID);
    }

    function unlockGate() {
        if (typeof gateLeftID !== undefined) {
            Entities.editEntity(gateLeftID, {angularVelocity: {x: 0, y: GATE_OPEN_ANGLE_IN_RADIANS, z: 0}});
        }
        if (typeof gateRightID !== undefined) {
            Entities.editEntity(gateRightID, {angularVelocity: {x: 0, y: -GATE_OPEN_ANGLE_IN_RADIANS, z: 0}});
        }
    }

    function resetGate() {
        if (typeof gateLeftID !== undefined) {
            Entities.editEntity(gateLeftID, {rotation: {x: 0, y: 0, z: 0, w: 0}});
        }
        if (typeof gateRightID !== undefined) {
            Entities.editEntity(gateRightID, {rotation: {x: 0, y: 0, z: 0, w:0}});
        }
    }

	function handleMessages(channel, message, sender) {
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
        if (channel === potionToMainChannel) {
            print("main recieved message from lever area: " + message);
            givePlayerMagic(sender);
        }
    }

	function cleanup() {
        print("escape the elevator main cleanup");
        resetGate();
        Messages.unsubscribe(leverToMainChannel);
        Messages.unsubscribe(leverAreaToMainChannel);
        Messages.messageReceived.disconnect(handleMessages);
    }

	Script.scriptEnding.connect(cleanup);
}());