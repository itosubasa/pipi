"use strict";
var SimpleFilter = require("./Kanna_filter/simpleFilter");
var SpamFilter = require("./Kanna_filter/spamFilter");
var ButtonFilter = require("./Kanna_filter/buttonFilter");
var EndFilter = require("./Kanna_filter/endFilter");

var async = require("asyncawait/async");
var await = require("asyncawait/await");

var Kanna_REPLY_TYPE = require("./constants").Kanna_REPLY_TYPE;
var BUTTON_TYPE = require("./constants").BUTTON_TYPE;
var PAYLOAD = require("./constants").PAYLOAD;


var fbAPI = require("./api/facebookAPI");

var ulti = require("./utilities");


class KannaAsync {
    constructor() {


       this._helloFilter = new SimpleFilter(["hi", "halo", "hế nhô", "he lo", "hello", "chào", "xin chào"], "Chào bạn, mềnh là Kanna  ^_^");
        this._goodbyeFilter = new SimpleFilter(["tạm biệt", "bye", "bai bai", "good bye"], "Tạm biệt, hẹn gặp lại ;)");
		
        this._filters = [new SpamFilter(),
        
            this._goodbyeFilter, this._helloFilter, new EndFilter()
        ];
    }

    setSender(sender) {
        this._helloFilter.setOutput(`Chào ${sender.first_name}, Em là Kanna Kamui ^^`);
        this._goodbyeFilter.setOutput(`Tạm biệt ${sender.first_name}, hẹn gặp lại ;)`);
    }

    chat(input) {
        for (var filter of this._filters) {
            if (filter.isMatch(input)) {
                filter.process(input);
                return filter.reply(input);
            }
        }
    }

    reply(senderId, textInput) {
        async(() => {
            var sender = await (fbAPI.getSenderName(senderId));
            this.setSender(sender);

            var KannaReply = await (this.chat(textInput));
            var output = KannaReply.output;
            switch (KannaReply.type) {
                case Kanna_REPLY_TYPE.TEXT:
                    fbAPI.sendTextMessage(senderId, output);
                    break;
                case Kanna_REPLY_TYPE.BUTTONS:
                    let buttons = KannaReply.buttons;
                    fbAPI.sendButtonMessage(senderId, output, buttons);
            
             
                    break;
                default:
            }
        })();
    }


    processImage(senderId, imageUrl) {
        // If the image is not an emo
       
            fbAPI.sendImage(senderId, imageUrl);
    

    }

    processPostback(senderId, payload) {
        async(() => {
            var sender = await (fbAPI.getSenderName(senderId));
            this.setSender(sender);
            switch (payload) {
        
                case PAYLOAD.HELP:
                    this.reply(senderId, "-help");
                    break;
             
                default:
                    console.log("Unknown payload: " + payload);
            }
        })();
    }
}

module.exports = new KannaAsync();
