const http = require('http');

// Test 1: GET /api/hours
console.log('\n📋 TEST 1: GET /api/hours');
const options1 = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/hours',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req1 = http.request(options1, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('✅ Success! Response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('❌ Error parsing response:', data);
    }
  });
});

req1.on('error', (err) => {
  console.error('❌ Request failed:', err.message);
});

req1.end();

// Test 2: Test login endpoint
setTimeout(() => {
  console.log('\n📋 TEST 2: POST /api/login');
  const loginData = JSON.stringify({ username: 'admin', password: 'admin123' });
  
  const options2 = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  const req2 = http.request(options2, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.user && parsed.user.MaxHoursAllowed !== undefined) {
          console.log('✅ Login works! MaxHoursAllowed in response:', parsed.user.MaxHoursAllowed);
        } else {
          console.log('⚠️ Login response received but no MaxHoursAllowed:', JSON.stringify(parsed, null, 2));
        }
      } catch (e) {
        console.log('Response:', data);
      }
    });
  });

  req2.on('error', (err) => {
    console.error('❌ Login request failed:', err.message);
  });

  req2.write(loginData);
  req2.end();
}, 1000);
