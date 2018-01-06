'user strict';

// Include response helper for handling responses
var responseHelper = require('./responseHelper');

/**
 * Event helper for NationalParkFinder
 */
var eventHelper = (function () {
    
    /**
     * Handle when the intent is launched without a question or statement
     * @param launchRequest - the lauch request
     * @param session - the session
     * @param response - the response
     */
    var _onLaunch = function (launchRequest, session, response) {
        responseHelper.handleWelcome(response);
    };
    
    /**
     * Register event handlers
     * @param eventHandlers - the NationalParkFinder event handlers
     */
    var registerHandlers = function (eventHandlers) {
        eventHandlers.onLaunch = _onLaunch;
    };
    
    // Expose public functions
    return {
        registerHandlers: registerHandlers
    };
    
}) ();

module.exports = eventHelper;
