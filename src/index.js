/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space NationalParkFinder"
 *  Alexa: "Here's your space NationalParkFinder: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing space NationalParkFinders.
 */
var NATIONAL_PARKS = {
    "alaska": ["Denali", "Gates of the Arctic", "Glacier Bay", "Katmai", "Kenai Fjords", "Kobuk Valley", "Lake Clark", "Wrangell - St. Elias"],
    "american samoa": ["American Samoa"],
    "arizona": ["Grand Canyon", "Petrified Forest", "Saquaro"],
    "arkansas": ["Hot Springs"],
    "california": ["Channel Islands", "Death Valley", "Joshua Tree", "Kings Canyon", "Lassen Volcanic", "Redwood", "Sequoia", "Yosemite"],
    "colorado": ["Black Canyon of the Gunnison", "reat Sand Dunes", "Mesa Verde", "Rocky Mountain"],
    "florida": ["Biscayne", "Dry Tortugas", "Everglades"],
    "hawaii": ["Haleakala", "Hawaii Volcanoes"],
    "idaho": ["Yellowstone"],
    "kentucky": ["Mammoth Cave"],
    "maine": ["Acadia"],
    "michigan": ["Isle Royale"],
    "minnesota": ["Voyageurs"],
    "montana": ["Glacier", "Yellowstone"],
    "nevada": ["Great Basin"],
    "new mexico": ["Carlsbad Caverns"],
    "north carolina": ["Great Smoky Mountains"],
    "north dakota": ["Theodore Roosevelt"],
    "ohio": ["Cuyahoga Valley"],
    "oregon": ["Crater Lake"],
    "south sarolina": ["Congaree"],
    "south dakota": ["Badlands", "Wind Cave"],
    "tennessee": ["Great Smoky Mountains"],
    "texas": ["Big Bend", "Guadalupe Mountains"],
    "u s virgin islands": ["Virgin Islands"],
    "utah": ["Arches", "Bryce Canyon", "Capitol Reef", "Canyonlands", "Zion"],
    "virginia": ["Shenandoah"],
    "washington": ["Mount Rainier", "North Cascades", "Olympic"],
    "wyoming": ["Grand Teton", "Yellowstone"]
};

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SpaceGeek is a child of AlexaSkill.
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
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

NationalParkFinder.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    welcomeIntent(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
NationalParkFinder.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

NationalParkFinder.prototype.intentHandlers = {
    
    "WhatParksInStateIntent": function (intent, session, response) {
        whatParksInStateIntent(intent, response);
    },
    
    "HowManyParksInStateIntent": function (intent, session, response) {
        howManyParksInStateIntent(intent, response);
    },
    
    "StateOnlyIntent": function (intent, session, response) {
        stateOnlyIntent(intent, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say the state you want to find national parks in, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function getNationalParksSentence(state, parksOnly, countOnly) {
    var sentence = "";
    
    if (NATIONAL_PARKS[state]) {
        
        var nationalParks = NATIONAL_PARKS[state];
        var nationalParksCount = nationalParks.length;
        var nationalParksString = nationalParks.join(", ");
        var lastCommaIndex = nationalParksString.lastIndexOf(",");
        
        nationalParksString = nationalParksString.substr(0, lastCommaIndex)
                            + ", and" + nationalParksString.substr(lastCommaIndex + 1)
        
        if (parksOnly) {
            sentence = "Here are the national parks in " + state + " : " + nationalParksString + ".";
        } else if (countOnly) {
            sentence = "There are " + nationalParksCount + " national parks in " + state;
        } else {
             sentence = "There are " + nationalParksCount + " national parks in " + state + " : "
                      + nationalParksString+ ".";
        }
        
    } else {
        sentence = "Unfortunately there are no national parks in : " + state + ".";
    }
    
    return sentence;
}

/**
 * Welcome user
 */
function welcomeIntent(response) {
    
    var cardTitle = "National Park Finder";
    var speechOutput = "Welcome to National Park Finder!  Ask me a question to get started.";
    
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

/**
 * Find out which parks are in a particular state
 */
function whatParksInStateIntent(intent, response) {
    
    var state = intent.slots.State.value.toLowerCase();
    var cardTitle = "Your National Parks";
    var speechOutput = getNationalParksSentence(state, true, false);
    
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

/**
 * Find out how many parks are in a particular state
 */
function howManyParksInStateIntent(intent, response) {
    
    var state = intent.slots.State.value.toLowerCase();
    var cardTitle = "Your National Parks";
    var speechOutput = getNationalParksSentence(state, false, true);
    
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

/**
 * Find out how many parks are in a particular state
 */
function stateOnlyIntent(intent, response) {
    
    var state = intent.slots.State.value.toLowerCase();
    var cardTitle = "Your National Parks";
    var speechOutput = getNationalParksSentence(state, false, false);
    
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var nationalParkFinder = new NationalParkFinder();
    nationalParkFinder.execute(event, context);
};

