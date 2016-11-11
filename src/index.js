
/**
 * App ID for the skill
 */
var APP_ID = undefined;

/**
 * Array containing states
 */
var STATES = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * HTTPS library
 */
var https = require('https');

/**
 * NationalParkFinder is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var NationalParkFinder = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
NationalParkFinder.prototype = Object.create(AlexaSkill.prototype);
NationalParkFinder.prototype.constructor = NationalParkFinder;

NationalParkFinder.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
};

NationalParkFinder.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    welcomeIntent(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
NationalParkFinder.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
};

NationalParkFinder.prototype.intentHandlers = {
    
    "WhatParksInStateIntent": function (intent, session, response) {
        whatParksInStateIntent(intent, session, response);
    },
    
    "HowManyParksInStateIntent": function (intent, session, response) {
        howManyParksInStateIntent(intent,  session, response);
    },
    
    "StateOnlyIntent": function (intent, session, response) {
        stateOnlyIntent(intent,  session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var helpQuestion = "You can say the state you want to find national parks in, or, you can say exit... What can I help you with?";
        response.ask(helpQuestion, "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        response.tell("Goodbye");
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        response.tell("Goodbye");
    }
};

function getStateCode(state) {
    for (var stateCode in STATES) {
        if (STATES[stateCode].toLowerCase() == state.toLowerCase()) {
            return stateCode;
        }
    }
}

function getNationalParks(state, callback) {
    var nationalParks = [], 
        parksArray = [],
        parksJson = "",
        apiOptions = {
            hostname: "developer.nps.gov",
            port: 443,
            path: "/api/v0/parks?stateCode=" + getStateCode(state),
            headers: {
                "Authorization": "D2A39A3C-85B2-4F9F-8CB4-0095596E3C1E"
            }
        };
    https.get(apiOptions, function (response) {
        var body = '';
        response.on('data', function (data) {
            body += data;
        });
        response.on('end', function () {
            parksJson = JSON.parse(body);
            parksArray = parksJson.data;
            for (var i=0; i<parksArray.length; i++) {
                if (parksArray[i].designation == "National Park") {
                    nationalParks.push(parksArray[i]);
                }
            }
            callback(nationalParks);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

function getNationalParksSentence(state, nationalParks, parksOnly, countOnly) {
    var sentence = "";
    
    if (nationalParks.length > 0) {
        
        var nationalParksCount = nationalParks.length,
            nationalParkNames = [],
            nationalParksString = "";
        
        for (var i=0; i<nationalParksCount; i++) {
            nationalParkNames.push(nationalParks[i].name);
        }
        nationalParksString = nationalParkNames.join(", ");
        
        if (nationalParksCount >= 2) {
            var lastCommaIndex = nationalParksString.lastIndexOf(",");
            if (nationalParksCount == 2) {
                nationalParksString = nationalParksString.substr(0, lastCommaIndex)
                                    + " and" + nationalParksString.substr(lastCommaIndex + 1);
            } else {
                nationalParksString = nationalParksString.substr(0, lastCommaIndex)
                                    + ", and" + nationalParksString.substr(lastCommaIndex + 1);
            }
        }
        
        if (parksOnly) {
            if (nationalParksCount == 1) {
                sentence = nationalParksString + " is the only national park in " + state + ".";
            } else {
                sentence = "Here are the national parks in " + state + " : " + nationalParksString + ".";
            }
        } else if (countOnly) {
            if (nationalParksCount == 1) {
                sentence = "There is only one national park in " + state + ".";
            } else {
                sentence = "There are " + nationalParksCount + " national parks in " + state;
            }
        } else {
            if (nationalParksCount == 1) {
                sentence = "There is only one national park in " + state + " : "
                         + nationalParksString + ".";
            } else {
                sentence = "There are " + nationalParksCount + " national parks in " + state + " : "
                         + nationalParksString + ".";
            }
        }
        
    } else {
        sentence = "Unfortunately, there are no national parks in " + state + ".";
    }
    
    return sentence;
}

/**
 * Welcome user
 */
function welcomeIntent(response) {
    
    var cardTitle = "National Park Finder";
    var speechOutput = "Welcome to National Park Finder!  Which state would you like to find parks in?";
    var repromptOutput = "With National Park Finder, you can find parks in any state or US Territory.";
    var cardOutput = "National Park Finder.  Which state do you want to find parks in?";
    
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
}

/**
 * Find out which parks are in a particular state
 */
function whatParksInStateIntent(intent, session, response) {
    var state = intent.slots.State.value.toLowerCase();
    getNationalParks(state, function (nationalParks) {
        var cardTitle = "Your National Parks";
        var speechOutput = getNationalParksSentence(state, nationalParks, true, true);
        response.tellWithCard(speechOutput, cardTitle, speechOutput);
    });
}

/**
 * Find out how many parks are in a particular state
 */
function howManyParksInStateIntent(intent, session, response) {
    var state = intent.slots.State.value.toLowerCase();
    getNationalParks(state, function (nationalParks) {
        var cardTitle = "Your National Parks";
        var speechOutput = getNationalParksSentence(state, nationalParks, false, true);
        response.tellWithCard(speechOutput, cardTitle, speechOutput);
    });
}

/**
 * Find out how many parks are in a particular state
 */
function stateOnlyIntent(intent, session, response) {
    var state = intent.slots.State.value.toLowerCase();
    getNationalParks(state, function (nationalParks) {
        var cardTitle = "Your National Parks";
        var speechOutput = getNationalParksSentence(state, nationalParks, false, false);
        response.tellWithCard(speechOutput, cardTitle, speechOutput);
    });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var nationalParkFinder = new NationalParkFinder();
    nationalParkFinder.execute(event, context);
};

