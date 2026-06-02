require('dotenv').config();
const http = require('http');

const API_URL = `http://localhost:${process.env.PORT || 3000}`;

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  console.log('Testing Book Worm API...\n');
  console.log(`API URL: ${API_URL}\n`);

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Health Check
  try {
    console.log('Test 1: Health Check');
    const response = await makeRequest('GET', '/health');
    if (response.status === 200 && response.data.success) {
      console.log('✓ PASSED - Health check successful');
      console.log(`  Response: ${response.data.message}\n`);
      passedTests++;
    } else {
      console.log('✗ FAILED - Health check failed');
      console.log(`  Status: ${response.status}\n`);
      failedTests++;
    }
  } catch (error) {
    console.log('✗ FAILED - Cannot connect to API');
    console.log(`  Error: ${error.message}`);
    console.log('  Make sure the server is running: npm run dev\n');
    failedTests++;
  }

  // Test 2: Get All Coupons
  try {
    console.log('Test 2: Get All Active Coupons');
    const response = await makeRequest('GET', '/api/v1/coupons');
    if (response.status === 200 && response.data.success) {
      console.log('✓ PASSED - Retrieved coupons successfully');
      console.log(`  Total coupons: ${response.data.data.length}`);
      if (response.data.data.length > 0) {
        console.log(`  Sample: ${response.data.data[0].code} - ${response.data.data[0].description}`);
      }
      console.log();
      passedTests++;
    } else {
      console.log('✗ FAILED - Could not retrieve coupons');
      console.log(`  Status: ${response.status}\n`);
      failedTests++;
    }
  } catch (error) {
    console.log('✗ FAILED - Error retrieving coupons');
    console.log(`  Error: ${error.message}\n`);
    failedTests++;
  }

  // Test 3: Validate Valid Coupon
  try {
    console.log('Test 3: Validate Valid Coupon (WELCOME10)');
    const response = await makeRequest('POST', '/api/v1/coupons/validate', {
      code: 'WELCOME10',
      orderAmount: 500
    });
    if (response.status === 200 && response.data.success) {
      console.log('✓ PASSED - Coupon validated successfully');
      console.log(`  Coupon: ${response.data.coupon.code}`);
      console.log(`  Discount: ₹${response.data.discountAmount}`);
      console.log(`  Message: ${response.data.message}\n`);
      passedTests++;
    } else {
      console.log('✗ FAILED - Coupon validation failed');
      console.log(`  Status: ${response.status}`);
      console.log(`  Message: ${response.data?.message || 'Unknown error'}\n`);
      failedTests++;
    }
  } catch (error) {
    console.log('✗ FAILED - Error validating coupon');
    console.log(`  Error: ${error.message}\n`);
    failedTests++;
  }

  // Test 4: Validate Invalid Coupon
  try {
    console.log('Test 4: Validate Invalid Coupon (INVALID)');
    const response = await makeRequest('POST', '/api/v1/coupons/validate', {
      code: 'INVALID',
      orderAmount: 500
    });
    if (response.status === 404 && !response.data.success) {
      console.log('✓ PASSED - Invalid coupon correctly rejected');
      console.log(`  Message: ${response.data.message}\n`);
      passedTests++;
    } else {
      console.log('✗ FAILED - Invalid coupon should be rejected');
      console.log(`  Status: ${response.status}\n`);
      failedTests++;
    }
  } catch (error) {
    console.log('✗ FAILED - Error testing invalid coupon');
    console.log(`  Error: ${error.message}\n`);
    failedTests++;
  }

  // Test 5: Validate Coupon with Insufficient Order Amount
  try {
    console.log('Test 5: Validate Coupon with Low Order Amount');
    const response = await makeRequest('POST', '/api/v1/coupons/validate', {
      code: 'WELCOME10',
      orderAmount: 100  // Below minimum of 299
    });
    if (response.status === 400 && !response.data.success) {
      console.log('✓ PASSED - Low order amount correctly rejected');
      console.log(`  Message: ${response.data.message}\n`);
      passedTests++;
    } else {
      console.log('✗ FAILED - Should reject low order amount');
      console.log(`  Status: ${response.status}\n`);
      failedTests++;
    }
  } catch (error) {
    console.log('✗ FAILED - Error testing minimum order amount');
    console.log(`  Error: ${error.message}\n`);
    failedTests++;
  }

  // Test 6: Validate Coupon without Code
  try {
    console.log('Test 6: Validate Without Coupon Code');
    const response = await makeRequest('POST', '/api/v1/coupons/validate', {
      orderAmount: 500
    });
    if (response.status === 400 && !response.data.success) {
      console.log('✓ PASSED - Missing code correctly rejected');
      console.log(`  Message: ${response.data.message}\n`);
      passedTests++;
    } else {
      console.log('✗ FAILED - Should reject missing code');
      console.log(`  Status: ${response.status}\n`);
      failedTests++;
    }
  } catch (error) {
    console.log('✗ FAILED - Error testing missing code');
    console.log(`  Error: ${error.message}\n`);
    failedTests++;
  }

  // Summary
  console.log('='.repeat(50));
  console.log('Test Summary:');
  console.log(`  Total Tests: ${passedTests + failedTests}`);
  console.log(`  ✓ Passed: ${passedTests}`);
  console.log(`  ✗ Failed: ${failedTests}`);
  console.log('='.repeat(50));

  if (failedTests === 0) {
    console.log('\n✓ All tests passed successfully!');
    process.exit(0);
  } else {
    console.log('\n✗ Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run tests
testAPI().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});

// Made with Bob
