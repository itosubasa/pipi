"use strict";
var util = require("./../utilities");
var _ = require("underscore");
var Kanna_REPLY_TYPE = require("./../constants").Kanna_REPLY_TYPE;

class SpamFilter {
    process(input) {}

    isMatch(input) {
        return input == null || input.trim().length < 2;
    }
    reply(input) {
        return new Promise((resolve, reject) => resolve({
            output: "Server yếu lắm, đừng spam tội Kanna",
            type: Kanna_REPLY_TYPE.TEXT
        }));
    }

}


module.exports = SpamFilter;