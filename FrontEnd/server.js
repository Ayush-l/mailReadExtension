const express = require('express');
const path = require('path');
const app = express();
const fetch = require('node-fetch');

// Serve tracking pixel and log open
app.get('/blank', (req, res) => {
  const emailId = req.query.email_id;
  const URL='<BackEnd_URL>';
  fetch(`${URL}/mail/visit/${emailId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('✅ Visit count updated');
  })
  .catch(error => {
    console.error('❌ Error updating visit count:', error);
  });

  // ✅ Serve a 1x1 transparent image
  const pixelPath = path.join(__dirname, 'transparent.png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(pixelPath);
});

app.listen(3000, () => {
  console.log('📡 Pixel image tracker running on http://localhost:3000/blank');
});
