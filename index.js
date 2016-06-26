var http = require('http'),
    express = require('express'),
    app = express(),
    apn = require('apn'),
    apnConnection,
    deviceTokens = [];

const options = {
  "production" : false,
  "cert" : __dirname + "/certs/cert.pem",
  "key" : __dirname + "/certs/key.pem"
};

apnConnection = new apn.Connection(options);

function transmissionError(errCode, notification, device)
{
  console.log('encountered a transmission error with data: ' , errCode + ', ' , notification + ', ', device);
}

apnConnection.on('transmissionError', transmissionError);

app.set('port', 3001);

app.get('/registerDeviceToken/:token', function(req, res) {
  console.log('request info: ' , req);

  var token = req.params.token;

  deviceTokens.push(token);

  console.log('registered device token: ' + token);

  res.status(201).send({"status" : "OK"});
});

app.get('/deregisterDeviceToken/:token', function(req, res) {
  var params = req.params,
      token = params.token;

  for (var i = 0; i < deviceTokens.length; i++) {
    var existToken = deviceTokens[i];

    if (existToken == token) {
      deviceTokens.splice(i, 1);
      break;
    }
  }

  console.log('deregistered token');

  res.status(201).send({"status" : "OK"});
});

app.get('/motionDetected/:cameraName', function(req, res) {
  var params = req.params,
      cameraName = params.cameraName;

  for (var i = 0; i < deviceTokens.length; i++) {
    var token = deviceTokens[i];

    var notification = new apn.Notification();
    notification.badge = 0;
    notification.sound = 'default';
    notification.alert = 'Motion Detected from ' + cameraName;
    notification.payload = {'messageFrom' : 'Raspberry Pi'};

    var device = new apn.Device(token);

    apnConnection.pushNotification(notification, device);
  }

  console.log('detected motion, sent ' + deviceTokens.length + ' push notifications');

  res.status(201).send({"status" : "OK"});
});



http.createServer(app).listen(app.get('port'), function() {
  console.log('initiated HTTP server');
});
