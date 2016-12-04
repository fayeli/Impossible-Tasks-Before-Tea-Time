(function() {
	var spellToMagicBoxChannel = "Spell-To-Magic-Box-Channel";
	var MAGICBOX_SCRIPT_URL = "https://hifi-content.s3.amazonaws.com/faye/vrhackathonsf/magicBoxEntityScript.js";

	var pos = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getFront(Camera.getOrientation())))
	var props = {
		name: "Magic-Box",
		type: "Box",
		position: pos,
		script: MAGICBOX_SCRIPT_URL
	}
	Entities.addEntity(props);

	// set a bit of delay so that entity server have time to do its thing
	Script.setTimeout(function() {
		Messages.sendMessage(spellToMagicBoxChannel, "NOT griefing");
	}, 100);
}());