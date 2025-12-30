const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Main test function
async function runTests() {
  console.log('🚀 FUTURE TIMESHEET ENTRIES TEST\n');

  try {
    // Test 1: Create future entries with 15 hours each
    console.log('📝 Creating future timesheet entries with 15 hours each...\n');

    const futureEntries = [];
    const today = new Date();

    // Create entries for next 7 days
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dateStr = futureDate.toISOString().split('T')[0];

      const entry = {
        EmployeeID: 1,
        Date: dateStr,
        ProjectID: '1',
        Cateogary: 'Development',
        TaskID: `FUT${i}`,
        Task: `Future Task ${i}`,
        TotalHours: 15,
        Comment: `Test entry for ${dateStr}`,
        Status: 'Draft'
      };
      futureEntries.push(entry);
    }

    // Add each entry
    for (const entry of futureEntries) {
      const options = {
        hostname: 'localhost',
        port: 4000,
        path: '/api/timesheet-entry',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        const response = await makeRequest(options, entry);
        console.log(`✅ Entry for ${entry.Date}: Status ${response.status}`);
        console.log(`   Task: ${entry.Task} (${entry.TotalHours} hours)\n`);
      } catch (err) {
        console.log(`❌ Error creating entry for ${entry.Date}:`, err.message, '\n');
      }
    }

    // Test 2: Query the entries
    console.log('\n📊 Fetching all entries to verify...\n');
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/timesheet/1',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await makeRequest(options);
    console.log('All Timesheet Entries:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (err) {
    console.error('❌ Test failed:', err);
  }

  console.log('\n✅ Tests completed');
  process.exit(0);
}

// Run tests
runTests();
