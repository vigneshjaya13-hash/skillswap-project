const https = require('https');

https.get('https://text.pollinations.ai/Hello%20how%20are%20you?', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
}).on('error', err => console.log('Error:', err.message));
