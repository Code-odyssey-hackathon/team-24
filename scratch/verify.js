const http = require('http');

const postData = JSON.stringify({
  title: 'Backend Verification',
  description: 'Testing the new modular backend',
  priority: 'high'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/tasks',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Response:', body);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
  process.exit(1);
});

req.write(postData);
req.end();
