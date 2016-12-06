//
//  escapeTheElevatorMain.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
    var WONDER_NUMBER = 10;
    var wonderCounter = 0;
    var speechToMainChannel ="Speech-To-Main-Channel";
    var cakeIDs = ["{21b266ec-c4e7-458e-8d68-d6c6a6e82e04}", "{f38b1af8-c19c-4f8a-aacf-13d39d19f113}", "{03290e4f-2cf1-4ce9-9109-7b1694654144}", "{89c32f7d-4079-4eec-9e6d-62ebc51ce920}", "{a4510a93-6da8-4bc1-9ab1-80c0dc586eef}"];

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
        Settings.setValue("hackathon-spell-enabled", false);
        cakeIDs.forEach(function(id){
                    Entities.editEntity(id, {visible: false});
                });
        gateOpenSound = SoundCache.getSound(GATE_OPEN_SOUND_URL);
        Messages.subscribe(speechToMainChannel);
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
                        dimensions: {x: 0.2256, y:0.0858, z:0.0100},
                        text: "Open Me",
                        lineHeight: 0.06,
                        name: "Gate-Lock",
                        position: GATE_LOCK_POSITION,
                        script: GATE_LOCK_SCRIPT_URL
                    };
                    gateLockID = Entities.addEntity(props);
                }
            } else if (message === "hide key") {
                Entities.deleteEntity(gateLockID);
                gateLockID = null;
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
        if (channel === speechToMainChannel) {
            print("main recieved message from speech: " + message);
            wonderCounter++;
            if (wonderCounter >= WONDER_NUMBER) {
                print("WIN WIN WIN TEA TIME");
                // TODO: spawn cakes from sky
                // right now we toggle visibiliy
                cakeIDs.forEach(function(id){
                    Entities.editEntity(id, {visible: true});
                });
            }
        }
    }

	function cleanup() {
        print("escape the elevator main cleanup");
        resetGate();
        if (gateLockID !== null) {
            Entities.deleteEntity(gateLockID);
        }
        Messages.unsubscribe(speechToMainChannel);
        Messages.unsubscribe(gateLockToMainChannel);
        Messages.unsubscribe(leverToMainChannel);
        Messages.unsubscribe(leverAreaToMainChannel);
        Messages.messageReceived.disconnect(handleMessages);
    }

	Script.scriptEnding.connect(cleanup);
}());