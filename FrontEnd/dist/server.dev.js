"use strict";

var express = require('express');

var path = require('path');

var app = express();

var fetch = require('node-fetch'); // Serve tracking pixel and log open


app.get('/blank', function (req, res) {
  var emailId = req.query.email_id;
  var URL = 'https://cce8-2409-40d2-305e-bfb5-8cee-44db-b555-51b0.ngrok-free.app';
  fetch("".concat(URL, "/mail/visit/").concat(emailId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    console.log('✅ Visit count updated');
  })["catch"](function (error) {
    console.error('❌ Error updating visit count:', error);
  }); // ✅ Serve a 1x1 transparent image

  var pixelPath = path.join(__dirname, 'transparent.png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(pixelPath);
});
app.listen(3000, function () {
  console.log('📡 Pixel image tracker running on http://localhost:3000/blank');
});