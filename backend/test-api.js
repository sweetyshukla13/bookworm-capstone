const http = require('http');

console.log('🧪 Testing API Endpoints...\n');

const endpoints = [
  { path: '/health', description: 'Server health check' },
  { path: '/api/v1/health', description: 'API health check' },
  { path: '/api/v1/books', description: 'Books endpoint' },
  { path: '/api/v1/categories', description: 'Categories endpoint' }
];

function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const status = res.statusCode === 200 ? '✅' : '❌';
        console.log(`${status} ${description}`);
        console.log(`   URL: http://localhost:3000${path}`);
        console.log(`   Status: ${res.statusCode}`);
        
        try {
          const json = JSON.parse(data);
          console.log(`   Response: ${json.message || json.status}`);
        } catch (e) {
          console.log(`   Response: ${data.substring(0, 100)}`);
        }
        console.log('');
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${description}`);
      console.log(`   URL: http://localhost:3000${path}`);
      console.log(`   Error: ${error.message}`);
      console.log('');
      resolve();
    });

    req.on('timeout', () => {
      console.log(`⏱️  ${description}`);
      console.log(`   URL: http://localhost:3000${path}`);
      console.log(`   Error: Request timeout`);
      console.log('');
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing server at http://localhost:3000\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.path, endpoint.description);
  }
  
  console.log('✅ Test complete!\n');
  console.log('💡 If you see 404 errors:');
  console.log('   1. Make sure backend server is running: cd book-worm/backend && npm run dev');
  console.log('   2. Check server logs for any errors');
  console.log('   3. Verify database connection: npm run db:test');
}

runTests();

// Made with Bob
