'user strict';

/**
 * App ID for the skill
 */
var APP_ID = undefined;

// Include required depedencies
var AlexaSkill = require('./AlexaSkill'),
    intentHelper = require('./intentHelper'),
    eventHelper = require('./eventHelper'),
    responseHelper = require('./responseHelper');

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


// Register the event and intent handlers
eventHelper.registerHandlers(NationalParkFinder.prototype.eventHandlers);
intentHelper.registerHandlers(NationalParkFinder.prototype.intentHandlers);

module.exports = NationalParkFinder;