//
//  Created by James B. Pollack @imgntn 6/15/2016
//  Copyright 2016 High Fidelity, Inc.
//
// Toggles track lighting on click or 'near trigger' from grab script.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {

    var SEARCH_RADIUS = 100;

    var _this;
    var utilitiesScript = Script.resolvePath('http://hifi-content.s3.amazonaws.com/james/tracklight/utils.js');
    Script.include(utilitiesScript);
    Switch = function() {
        _this = this;
        this.switchSound = SoundCache.getSound("http://hifi-content.s3.amazonaws.com/james/tracklight/lamp_switch_2.wav");
    };

    Switch.prototype = {
        clickReleaseOnEntity: function(entityID, mouseEvent) {
            if (!mouseEvent.isLeftButton) {
                return;
            }
            this.toggleLights();
        },

        startNearTrigger: function() {
            this.toggleLights();
        },

        getLights: function() {
            print('getting lights')
            var props = Entities.getEntityProperties(_this.entityID);
            //track is parent of switch and fixtures.  lamps are children of fixtures.
            var childrenOfTrack = Entities.getChildrenIDs(props.parentID);
            print('getting lights2 ')
                //dont count us since we're a switch
            var fixtures = childrenOfTrack.filter(function(item) {
                return item !== props.id
            });

            _this.fixtures = fixtures;

            print('fixtures' + fixtures)

            var lights = [];

            fixtures.forEach(function(fixture) {

                //now we got the light, just one child but it comes back as an array
                var results = Entities.getChildrenIDs(fixture);
                results.forEach(function(result) {
                    lights.push(result);
                });
            });

            return lights;

        },

        masterLightOn: function(masterLight) {
            _this.lights = _this.getLights();


            _this.fixtures.forEach(function(fixture) {
                var data = {
                    "Tex.light-off": "http://hifi-content.s3.amazonaws.com/james/tracklight/lamp1.fbx/justlamp.fbm/bulb-tex-off.jpg",
                    "Tex.light.on": "http://hifi-content.s3.amazonaws.com/james/tracklight/lamp1.fbx/justlamp.fbm/bulb-tex-on.jpg",
                    "Texture": "http://hifi-content.s3.amazonaws.com/james/tracklight/lamp1.fbx/justlamp.fbm/bulb-tex-on.jpg"
                };
                Entities.editEntity(fixture, {
                    textures: JSON.stringify(data)
                })
                print('fixture on')
            });

            print('lights? on ' + _this.lights)
            _this.lights.forEach(function(light) {
                Entities.editEntity(light, {
                    visible: true
                });
            });
        },

        masterLightOff: function(masterLight) {
            _this.lights = _this.getLights();

            _this.fixtures.forEach(function(fixture) {
                var data = {
                    "Tex.light-off": "http://hifi-content.s3.amazonaws.com/james/tracklight/lamp1.fbx/justlamp.fbm/bulb-tex-off.jpg",
                    "Tex.light.on": "http://hifi-content.s3.amazonaws.com/james/tracklight/lamp1.fbx/justlamp.fbm/bulb-tex-off.jpg",
                    "Texture": "http://hifi-content.s3.amazonaws.com/james/tracklight/lamp1.fbx/justlamp.fbm/bulb-tex-off.jpg"
                };

                Entities.editEntity(fixture, {
                    textures: JSON.stringify(data)
                })
                print('turned a fixture off')
            });



            print('lights? off ' + _this.lights)
            _this.lights.forEach(function(light) {
                Entities.editEntity(light, {
                    visible: false
                });
            });
        },

        toggleLights: function() {

            print('toggle lights')

            _this._switch = getEntityCustomData('home-switch', _this.entityID, {
                state: 'off'
            });

            if (this._switch.state === 'off') {

                _this.masterLightOn();

                setEntityCustomData('home-switch', _this.entityID, {
                    state: 'on'
                });

                Entities.editEntity(this.entityID, {
                    "animation": {
                        "currentFrame": 1,
                        "firstFrame": 1,
                        "hold": 1,
                        "lastFrame": 2,
                        "url": "http://hifi-content.s3.amazonaws.com/james/tracklight/lightswitch.fbx"
                    },
                });

            } else {

                _this.masterLightOff();

                setEntityCustomData('home-switch', _this.entityID, {
                    state: 'off'
                });

                Entities.editEntity(_this.entityID, {
                    "animation": {
                        "currentFrame": 3,
                        "firstFrame": 3,
                        "hold": 1,
                        "lastFrame": 4,
                        "url": "http://hifi-content.s3.amazonaws.com/james/tracklight/lightswitch.fbx"
                    },
                });
            }

            _this.position = Entities.getEntityProperties(_this.entityID, "position").position;
            Audio.playSound(_this.switchSound, {
                volume: 0.5,
                position: _this.position
            });

        },

        preload: function(entityID) {
            this.entityID = entityID;
            this.props = Entites.getEntityProperties(this.entityID);

            setEntityCustomData('grabbableKey', this.entityID, {
                wantsTrigger: true
            });

        }
    };

    return new Switch();
});