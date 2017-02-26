var http = require('http');
var log = require('simple-node-logger').createSimpleLogger('project.log');
var logger = require('morgan');
var bodyParser = require('body-parser');
var async = require("asyncawait/async");
var await = require("asyncawait/await");
var express = require('express');

var Kanna = require("./facebook_Kanna/Kanna");

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);

app.get('/', (req, res) => {
  res.send("Hello <3");
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'verify_token') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    log.info(entries);
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // If user send text
        if (message.message.text) {
          Kanna.reply(senderId, message.message.text);
        }
        // If user send attachment
        else if (message.message.attachments) {
          //Kanna.sendAttachmentBack(senderId, message.message.attachments[0]);
          if (message.message.attachments[0].payload != null) {
            var imageUrl = message.message.attachments[0].payload.url;
            Kanna.processImage(senderId, imageUrl);
          }
        }
      }
      // If user click button
      else if (message.postback) {
        var payload = message.postback.payload;
        Kanna.processPostback(senderId, payload);
      }
    }
  }

  res.status(200).send("OK");
});


app.set('port', process.env.PORT || 3002);
app.set('ip', process.env.IP || "127.0.0.1");

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Express server listening at %s:%d ", app.get('ip'), app.get('port'));
});