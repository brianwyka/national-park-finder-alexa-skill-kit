'use strict';

/**
 * Response helper for NationalParkFinder
 */
var responseHelper = (function () {
    
    /**
     * Get the sententence to return to the user
     * @param state - the state they provided
     * @param nationalParks - the national parks in the provided state
     * @param parksOnly - whether or not to only list parks
     * @param countOnly - whether or not to only state number of parks in state
     * @return the speech output to the user
     */
    var _getNationalParksSentence = function (state, nationalParks, parksOnly, countOnly) {
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
    };
    
    /**
     * Handle the welcome
     * @param response - the intent response
     */
    var handleWelcome = function (response) {
        var cardTitle = "National Park Finder";
        var speechOutput = "Welcome to National Park Finder!  Which state would you like to find parks in?";
        var repromptOutput = "With National Park Finder, you can find parks in any state or US Territory.";
        var cardOutput = "National Park Finder.  Which state do you want to find parks in?";
        response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
    };
    
    /**
     * Handle the "WhatParksInState" response
     * @param state - the state
     * @param nationalParks - the parks in the state
     * @param response - the intent response
     */
    var handleWhatParksInState = function (state, nationalParks, response) {
        var cardTitle = "Your National Parks";
        var speechOutput = _getNationalParksSentence(state, nationalParks, true, true);
        response.tellWithCard(speechOutput, cardTitle, speechOutput);
    };
    
    /**
     * Handle the "HowManyParksInState" response
     * @param state - the state
     * @param nationalParks - the parks in the state
     * @param response - the intent response
     */
    var handleHowManyParksInState = function (state, nationalParks, response) {
        var cardTitle = "Your National Parks";
        var speechOutput = _getNationalParksSentence(state, nationalParks, false, true);
        response.tellWithCard(speechOutput, cardTitle, speechOutput);
    };
    
   /**
     * Handle the "StateOnly" response
     * @param state - the state
     * @param nationalParks - the parks in the state
     * @param response - the intent response
     */
    var handleStateOnly = function (state, nationalParks, response) {
        var cardTitle = "Your National Parks";
        var speechOutput = _getNationalParksSentence(state, nationalParks, false, false);
        response.tellWithCard(speechOutput, cardTitle, speechOutput);
    };
    
    /**
     * Handle no state entered by user
     * @param response - the response to add error output to
     */
    var handleNoState  = function (response) {
        var speechOutput = "Sorry, I didn't understand your question, please repeat.";
        var repromptOutput = "Which state do you want to find parks in?";
        response.ask(speechOutput, repromptOutput);
    };
    
    /**
     * Handle a help intent
     * @param response - the response to add welcome to
     */
    var handleHelp = function (response) {
        var helpQuestion = "You can say the state you want to find national parks in, " 
                         + "or, you can say exit... What can I help you with?";
        response.ask(helpQuestion, "What can I help you with?");
    };
    
    /**
     * Handle exit request
     * @param response - the response to add error output to
     */
    var handleExit  = function (response) {
        response.tell("Thanks for using NationalParkFinder, goodbye");
    };
    
    // Expose public functions
    return {
        handleWelcome: handleWelcome,
        handleWhatParksInState: handleWhatParksInState,
        handleHowManyParksInState: handleHowManyParksInState,
        handleStateOnly: handleStateOnly,
        handleNoState: handleNoState,
        handleHelp: handleHelp,
        handleExit: handleExit
    };
    
}) ();

module.exports = responseHelper;