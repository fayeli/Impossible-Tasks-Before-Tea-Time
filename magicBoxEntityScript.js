//
//  magicBoxEntityScript.js
//
//  Created by Faye Li on December 3, 2016
//

(function() {
	var spellToMagicBoxChannel = "Spell-To-Magic-Box-Channel";

	function scaleAvatar() {
		for (var i = 0; i < 5; i++){
        	MyAvatar.decreaseSize();
    	}
	}

	function handleMessages(channel, message, sender) {
		// only make other avatars other than me small
		if (channel === spellToMagicBoxChannel && sender !== MyAvatar.sessionUUID) {
			scaleAvatar();
		}
	}

	this.preload =  function(entityID) {
		Messages.subscribe(spellToMagicBoxChannel);
		Messages.messageReceived.connect(handleMessages);
	};
	this.unload = function(entityID) {
		MyAvatar.resetSize();
		Messages.messageReceived.disconnect(handleMessages);
	}
});