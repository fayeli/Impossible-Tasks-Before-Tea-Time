(function() {
	var SECRET_COMMAND = "HELLO";
	SpeechRecognizer.addCommand(SECRET_COMMAND);
	SpeechRecognizer.commandRecognized.connect(function(command){
		if (command === SECRET_COMMAND) {
			print("I hear you!");
		}
	});
	function cleanup () {
		SpeechRecognizer.removeCommand(SECRET_COMMAND);
	}
	Script.scriptEnding.connect(cleanup);
}());