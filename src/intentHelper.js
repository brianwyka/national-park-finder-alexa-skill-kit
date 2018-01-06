'user strict';

// Include required dependencies
var nationalParkService = require('./nationalParkService'),
    helper = require('./helper'),
    responseHelper = require('./responseHelper');

/**
 * Intent helper for NationalParkFinder
 */
var intentHelper = (function () {
    
    /**
     * Get the state from the intent slot
     * @param intent - the intent
     * @param response - the intent response
     * @return the state from the intent or null if no state provided
     */
    var _getState = function (intent, response) {
        if (intent.slots.State && intent.slots.State.value) {
            return intent.slots.State.value.toLowerCase();
        }
        responseHelper.handleNoState(response);
        return null;
    };

    /**
     * Find out which parks are in a particular state
     * @param intent - the intent
     * @param session - the intent session
     * @param response - the response to add welcome to
     */
    var _whatParksInStateIntent = function (intent, session, response) {
        var state = _getState(intent, response);
        if (state) {
            var stateCode = helper.getStateCode(state);
            nationalParkService.getNationalParks(stateCode, function (nationalParks) {
                responseHelper.handleWhatParksInState(state, nationalParks, response);
            });
        }
    };

    /**
     * Find out how many parks are in a particular state
     * @param intent - the intent
     * @param session - the intent session
     * @param response - the response to add welcome to
     */
    var _howManyParksInStateIntent = function (intent, session, response) {
        var state = _getState(intent, response);
        if (state) {
            var stateCode = helper.getStateCode(state);
            nationalParkService.getNationalParks(stateCode, function (nationalParks) {
                responseHelper.handleHowManyParksInState(state, nationalParks, response);
            });
        }
    };

    /**
     * Find out how many parks are in a particular state
     * @param intent - the intent
     * @param session - the intent session
     * @param response - the response to add welcome to
     */
    var _stateOnlyIntent = function (intent, session, response) {
        var state = _getState(intent, response);
        if (state) {
            var stateCode = helper.getStateCode(state);
            nationalParkService.getNationalParks(stateCode, function (nationalParks) {
                responseHelper.handleStateOnly(state, nationalParks, response);
            });
        }
    };
    
    /**
     * Register intent handlers
     * @param intentHandlers - the NationalParkFinder intent handlers
     */
    var registerHandlers = function (intentHandlers) {
        intentHandlers["WhatParksInStateIntent"] = _whatParksInStateIntent;
        intentHandlers["HowManyParksInStateIntent"] = _howManyParksInStateIntent;
        intentHandlers["StateOnlyIntent"] = _stateOnlyIntent;
        intentHandlers["AMAZON.HelpIntent"] = function (intent, session, response) {
            responseHelper.handleHelp(response);
        };
        intentHandlers["AMAZON.StopIntent"] = function (intent, session, response) {
            responseHelper.handleExit(response);
        };
        intentHandlers["AMAZON.CancelIntent"] = function (intent, session, response) {
            responseHelper.handleExit(response);
        };
    };
    
    // Expose public functions
    return {
        registerHandlers: registerHandlers
    };
    
}) ();

module.exports = intentHelper;
