//
//  escapeTheElevatorMain.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
    var GATE_OPEN_SOUND_URL = "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/production/Hackathon/1216/audio/gate_opening.wav";
    var gateOpenSound;
    var gateLockToMainChannel = "Gate-Lock-To-Main-Channel";
	var leverToMainChannel = "Lever-To-Main-Channel";
    var mainToLeverChannel = "Main-To-Lever-Channel";
    var leverAreaToMainChannel = "Lever-Area-To-Main-Channel";
    var gateLeftID, gateRightID;
    var GATE_OPEN_ANGLE_IN_RADIANS = 0.872665;
    var GATE_LOCK_POSITION = {"x":-2.8724377155303955,"y":-201.08323669433594,"z":-20.129098892211914};
    var GATE_LOCK_SCRIPT_URL = "https://hifi-content.s3.amazonaws.com/faye/vrhackathonsf/gateLockEntityScript.js";
    var gateLockID = null;

    main();

    function main() {
        print("running esacape the elevator main");
        gateOpenSound = SoundCache.getSound(GATE_OPEN_SOUND_URL);
        Messages.subscribe(gateLockToMainChannel);
        Messages.subscribe(leverToMainChannel);
        Messages.subscribe(leverAreaToMainChannel);
        Messages.messageReceived.connect(handleMessages);

        searchForEntities();
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

    function openGate() {
        Audio.playSound(gateOpenSound, {
                volume: 0.5,
                position: GATE_LOCK_POSITION
        });
        if (gateLockID !== null) {
            Entities.deleteEntity(gateLockID);
        }
        if (typeof gateLeftID !== undefined) {
            Entities.editEntity(gateLeftID, {angularVelocity: {x: 0, y: -GATE_OPEN_ANGLE_IN_RADIANS, z: 0}});
        }
        if (typeof gateRightID !== undefined) {
            Entities.editEntity(gateRightID, {angularVelocity: {x: 0, y: GATE_OPEN_ANGLE_IN_RADIANS, z: 0}});
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

            if (message === "show key") {
                if (gateLockID === null) {
                    var props = {
                        type: "Text",
                        text: "Open Me",
                        lineHeight: 0.01,
                        name: "Gate-Lock",
                        position: GATE_LOCK_POSITION,
                        script: GATE_LOCK_SCRIPT_URL
                    };
                    gateLockID = Entities.addEntity(props);
                }
            } else if (message === "hide key") {
                Entities.deleteEntity(gateLockID);
                gateLockID === null;
            }

        }
        if (channel === leverAreaToMainChannel) {
            // on a person leaving the lever area, the lever flips back and the gate locks up
            print("main recieved message from lever area: " + message);
            Messages.sendMessage(mainToLeverChannel, "toggle lever up");
        }
        if (channel === gateLockToMainChannel) {
            print("main recieved message from gate lock: " + message);
            openGate();
        }
    }

	function cleanup() {
        print("escape the elevator main cleanup");
        resetGate();
        if (gateLockID !== null) {
            Entities.deleteEntity(gateLockID);
        }
        Messages.unsubscribe(gateLockToMainChannel);
        Messages.unsubscribe(leverToMainChannel);
        Messages.unsubscribe(leverAreaToMainChannel);
        Messages.messageReceived.disconnect(handleMessages);
    }

	Script.scriptEnding.connect(cleanup);
}());