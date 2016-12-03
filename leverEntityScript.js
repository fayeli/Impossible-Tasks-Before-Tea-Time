//
//  leverEntityScript.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
    var LEVER_ANIMATION_URL = "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/hackathon/ITBTT/lever_with_keys.fbx";
    var TOGGLE_SOUND_URL = "http://hifi-content.s3.amazonaws.com/james/tracklight/lamp_switch_2.wav";
    var leverToMainChannel = "Lever-to-Main-Channel";
    var mainToLeverChannel = "Main-to-Lever-Channel";
    var SEARCH_RADIUS = 100;

    var _this;

    Lever = function() {
        _this = this;
    };

    Lever.prototype = {
        preload: function(entityID) {
            this.entityID = entityID;
            this.props = Entities.getEntityProperties(this.entityID);
            this.position = this.props.position;
            this.toggleSound = SoundCache.getSound(TOGGLE_SOUND_URL);

            setEntityCustomData('grabbableKey', this.entityID, {
                wantsTrigger: true
            });
            Messages.subscribe(mainToLeverChannel);
            Messages.messageReceived.connect(this.handleMessages);
        },

        handleMessages: function(channel, message, sender) {
            // only handle messages from me (who is running the main program)
            if (channel === mainToLeverChannel && sender === MyAvatar.sessionUUID) {
                print("lever recieved message from main: " + message);
                var currentState = getEntityCustomData('leverState', _this.entityID);
                if (message === "toggle lever up" && currentState === "down") {
                    this.toggle();
                }
            }
        },

        toggle: function() {
            print("lever toggle");

            // plays audio with audio injector
            Audio.playSound(_this.toggleSound, {
                volume: 0.5,
                position: this.position
            });

            // TODO: animates lever
            var currentState = getEntityCustomData('leverState', _this.entityID, "up");
            if (currentState === "up") {
                setEntityCustomData('leverState', _this.entityID, "down");
                Entities.editEntity(_this.entityID, {
                    "animation": {
                        "currentFrame": 3,
                        "firstFrame": 3,
                        "hold": 1,
                        "lastFrame": 4,
                        "url": LEVER_ANIMATION_URL
                    },
                });
                Messages.sendMessage(leverToMainChannel, "pls show key");
            } else if (currentState === "down") {
                setEntityCustomData('leverState', _this.entityID, "up");
                Entities.editEntity(_this.entityID, {
                    "animation": {
                        "currentFrame": 1,
                        "firstFrame": 1,
                        "hold": 1,
                        "lastFrame": 2,
                        "url": LEVER_ANIMATION_URL
                    },
                });
                Messages.sendMessage(leverToMainChannel, "pls hide key");
            }
        },

        clickReleaseOnEntity: function(entityID, mouseEvent) {
            if (!mouseEvent.isLeftButton) {
                return;
            }
            this.toggle();
        },

        startNearTrigger: function() {
            this.toggle();
        },
        unload: function() {
            print("lever entity unload");
            Messages.unsubscribe(mainToLeverChannel);
            Messages.messageReceived.disconnect(this.handleMessages);
        }
    };

    return new Lever();
});