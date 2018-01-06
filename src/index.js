// Include NationalParkFinder
var NationalParkFinder = require("./nationalParkFinder");

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the NationalParkFinder skill.
    var nationalParkFinder = new NationalParkFinder();
    nationalParkFinder.execute(event, context);
};