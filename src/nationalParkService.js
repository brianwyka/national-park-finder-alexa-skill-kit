'use strict';

// Include required https library
var https = require('https');

/**
 * National Park Service API
 */
var nationalParkService = (function () {
    
    var _API_KEY = "D2A39A3C-85B2-4F9F-8CB4-0095596E3C1E",
        _API_HOST = "developer.nps.gov",
        _API_PORT = 443,
        _API_PATH = "/api/v0/parks",
        _DESIGNATION = "National Park";

    /**
     * Get the array of national parks based on the state
     * @param stateCode - the state to find parks in
     * @param callback - the function to execute as callback
     */
    var getNationalParks = function (stateCode, callback) {
        var nationalParks = [], 
            parksArray = [],
            parksJson = "",
            apiOptions = {
                hostname: _API_HOST,
                port: _API_PORT,
                path: _API_PATH + "?stateCode=" + stateCode,
                headers: {
                    "Authorization": _API_KEY
                }
            };
        https.get(apiOptions, function (response) {
            var responseBody = '';
            response.on('data', function (data) {
                responseBody += data;
            });
            response.on('end', function () {
                parksJson = JSON.parse(responseBody);
                parksArray = parksJson.data;
                for (var i=0; i<parksArray.length; i++) {
                    if (parksArray[i].designation == _DESIGNATION) {
                        nationalParks.push(parksArray[i]);
                    }
                }
                callback(nationalParks);
            });
        }).on('error', function (e) {
            console.log("Error retrieving national parks from API for state []" + stateCode + "]: ", e);
        });
    };
    
    // Expose public functions
    return {
        getNationalParks: getNationalParks
    };
    
}) ();

module.exports = nationalParkService;