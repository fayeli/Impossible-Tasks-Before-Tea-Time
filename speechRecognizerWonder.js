(function() {
	var SECRET_COMMAND = "WONDER";
	var speechToMainChannel ="Speech-To-Main-Channel";
	SpeechRecognizer.addCommand(SECRET_COMMAND);
	SpeechRecognizer.commandRecognized.connect(function(command){
		if (command === SECRET_COMMAND) {
			print("I hear you!");
			Messages.sendMessage(speechToMainChannel, "wonder");
		}
	});
	function cleanup () {
		SpeechRecognizer.removeCommand(SECRET_COMMAND);
	}
	Script.scriptEnding.connect(cleanup);
}());