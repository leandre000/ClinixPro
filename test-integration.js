const axios = require('axios');

// Test configuration
const BACKEND_URL = 'http://localhost:8080/api';
const FRONTEND_URL = 'http://localhost:3000';

async function testBackendConnection() {
  console.log('🔍 Testing Backend Connection...');
  
  try {
    // Test backend health
    const healthResponse = await axios.get(`${BACKEND_URL}/auth/login`, {
      timeout: 5000,
      validateStatus: function (status) {
        return status < 500; // Accept 405 (Method Not Allowed) as success
      }
    });
    
    if (healthResponse.status === 405) {
      console.log('✅ Backend is running and responding (405 Method Not Allowed is expected for GET on login endpoint)');
      return true;
    } else {
      console.log(`✅ Backend is running and responding with status: ${healthResponse.status}`);
      return true;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running on port 8080');
    } else if (error.code === 'ENOTFOUND') {
      console.log('❌ Backend URL not found');
    } else {
      console.log(`❌ Backend connection error: ${error.message}`);
    }
    return false;
  }
}

async function testFrontendConnection() {
  console.log('\n🔍 Testing Frontend Connection...');
  
  try {
    const response = await axios.get(FRONTEND_URL, {
      timeout: 5000
    });
    
    console.log(`✅ Frontend is running and responding with status: ${response.status}`);
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Frontend is not running on port 3000');
    } else if (error.code === 'ENOTFOUND') {
      console.log('❌ Frontend URL not found');
    } else {
      console.log(`❌ Frontend connection error: ${error.message}`);
    }
    return false;
  }
}

async function testAPIIntegration() {
  console.log('\n🔍 Testing API Integration...');
  
  try {
    // Test a POST request to login endpoint (should return 400 for missing credentials, which is expected)
    const response = await axios.post(`${BACKEND_URL}/auth/login`, {}, {
      timeout: 5000,
      validateStatus: function (status) {
        return status < 500; // Accept 400 as success (missing credentials)
      }
    });
    
    if (response.status === 400) {
      console.log('✅ API integration working (400 Bad Request is expected for empty login data)');
      return true;
    } else {
      console.log(`✅ API integration working with status: ${response.status}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ API integration error: ${error.message}`);
    return false;
  }
}

async function runIntegrationTests() {
  console.log('🚀 Starting Integration Tests...\n');
  
  const backendOk = await testBackendConnection();
  const frontendOk = await testFrontendConnection();
  const apiOk = await testAPIIntegration();
  
  console.log('\n📊 Integration Test Results:');
  console.log(`Backend (Port 8080): ${backendOk ? '✅ Running' : '❌ Not Running'}`);
  console.log(`Frontend (Port 3000): ${frontendOk ? '✅ Running' : '❌ Not Running'}`);
  console.log(`API Integration: ${apiOk ? '✅ Working' : '❌ Failed'}`);
  
  if (backendOk && frontendOk && apiOk) {
    console.log('\n🎉 All integration tests passed! Frontend and Backend are properly connected.');
    console.log('\n📝 Next Steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Try logging in with the default credentials:');
    console.log('   - Email: admin@clinixpro.com');
    console.log('   - Password: password');
    console.log('3. Test the various dashboard features');
  } else {
    console.log('\n⚠️  Some integration tests failed. Please check:');
    if (!backendOk) console.log('- Ensure backend is running: cd backend && mvn spring-boot:run');
    if (!frontendOk) console.log('- Ensure frontend is running: npm run dev');
    if (!apiOk) console.log('- Check API configuration in src/services/api.js');
  }
}

// Run the tests
runIntegrationTests().catch(console.error); 