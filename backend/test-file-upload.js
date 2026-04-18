#!/usr/bin/env node

/**
 * File Upload Test Script
 * This script tests the file upload functionality with detailed logging
 */

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const API_URL = 'http://localhost:5000/api/users';
const TEST_FILES_DIR = path.join(__dirname, 'test-files');

console.log('='.repeat(80));
console.log('FILE UPLOAD TEST SCRIPT');
console.log('='.repeat(80));
console.log('');

// Create test files directory if it doesn't exist
if (!fs.existsSync(TEST_FILES_DIR)) {
  fs.mkdirSync(TEST_FILES_DIR, { recursive: true });
  console.log(`✓ Created test files directory: ${TEST_FILES_DIR}`);
}

// Create a simple test image file (1x1 pixel PNG)
const pngBuffer = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
  0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xFE,
  0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x49,
  0xB4, 0xE8, 0xB7, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

const testImagePath = path.join(TEST_FILES_DIR, 'test-image.png');
const testPdfPath = path.join(TEST_FILES_DIR, 'test-document.pdf');

// Create test files
if (!fs.existsSync(testImagePath)) {
  fs.writeFileSync(testImagePath, pngBuffer);
  console.log(`✓ Created test image: ${testImagePath}`);
}

if (!fs.existsSync(testPdfPath)) {
  // Simple PDF header
  const pdfContent = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>startxref 229 %%EOF';
  fs.writeFileSync(testPdfPath, pdfContent);
  console.log(`✓ Created test PDF: ${testPdfPath}`);
}

console.log('');
console.log('-'.repeat(80));
console.log('TEST CASES');
console.log('-'.repeat(80));
console.log('');

// Test Case 1: With both files
async function testWithBothFiles() {
  console.log('TEST 1: Upload with both profilePic and aadharCard');
  console.log('='.repeat(60));
  
  const form = new FormData();
  
  // Add form fields
  form.append('username', `testuser_${Date.now()}`);
  form.append('email', `test_${Date.now()}@example.com`);
  form.append('password', 'TestPassword123!');
  form.append('confirmPassword', 'TestPassword123!');
  form.append('userType', 'student');
  form.append('firstName', 'Test');
  form.append('lastName', 'User');
  form.append('phone', '9876543210');
  form.append('grade', '10');
  form.append('class', 'A');
  
  // Add test files
  form.append('profilePic', fs.createReadStream(testImagePath), 'profile.png');
  form.append('aadharCard', fs.createReadStream(testPdfPath), 'aadhar.pdf');
  
  console.log(`[REQUEST] POST ${API_URL}`);
  console.log('[HEADERS] Content-Type:', form.getHeaders()['content-type']);
  console.log('[BODY] FormData with:');
  console.log('  - Text fields: username, email, password, confirmPassword, userType, firstName, lastName, phone, grade, class');
  console.log('  - File fields: profilePic (PNG), aadharCard (PDF)');
  console.log('');
  
  return await sendRequest(form);
}

// Test Case 2: With only profilePic
async function testWithOnlyProfilePic() {
  console.log('TEST 2: Upload with only profilePic');
  console.log('='.repeat(60));
  
  const form = new FormData();
  
  form.append('username', `testuser_${Date.now()}`);
  form.append('email', `test_${Date.now()}@example.com`);
  form.append('password', 'TestPassword123!');
  form.append('confirmPassword', 'TestPassword123!');
  form.append('userType', 'student');
  form.append('firstName', 'Test');
  form.append('lastName', 'User');
  
  form.append('profilePic', fs.createReadStream(testImagePath), 'profile.png');
  
  console.log(`[REQUEST] POST ${API_URL}`);
  console.log('[BODY] FormData with:');
  console.log('  - Text fields: username, email, password, etc.');
  console.log('  - File fields: profilePic (PNG only)');
  console.log('');
  
  return await sendRequest(form);
}

// Test Case 3: With no files
async function testWithNoFiles() {
  console.log('TEST 3: Upload with no files');
  console.log('='.repeat(60));
  
  const form = new FormData();
  
  form.append('username', `testuser_${Date.now()}`);
  form.append('email', `test_${Date.now()}@example.com`);
  form.append('password', 'TestPassword123!');
  form.append('confirmPassword', 'TestPassword123!');
  form.append('userType', 'student');
  form.append('firstName', 'Test');
  form.append('lastName', 'User');
  
  console.log(`[REQUEST] POST ${API_URL}`);
  console.log('[BODY] FormData with:');
  console.log('  - Text fields only, NO FILES');
  console.log('');
  
  return await sendRequest(form);
}

// Send HTTP request
function sendRequest(form) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/users',
      method: 'POST',
      headers: form.getHeaders()
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        const response = {
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        };
        
        console.log(`[RESPONSE] Status: ${res.statusCode}`);
        console.log('[RESPONSE] Headers:', JSON.stringify(res.headers, null, 2));
        console.log('[RESPONSE] Body:', data);
        console.log('');
        
        resolve(response);
      });
    });
    
    req.on('error', (error) => {
      console.error('[ERROR]', error.message);
      reject(error);
    });
    
    form.pipe(req);
  });
}

// Run tests
async function runTests() {
  try {
    console.log('Make sure the server is running with: npm start');
    console.log('');
    
    // Test 1
    await testWithBothFiles();
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 2
    await testWithOnlyProfilePic();
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 3
    await testWithNoFiles();
    
    console.log('='.repeat(80));
    console.log('ALL TESTS COMPLETED');
    console.log('='.repeat(80));
    console.log('');
    console.log('Check the server logs to see:');
    console.log('  1. "User creation request received" - shows if files are arriving');
    console.log('  2. "Files detected in request" - shows which files were received');
    console.log('  3. "File record saved successfully" - shows if database insert worked');
    console.log('  4. "File upload skipped - no files provided" - for no-file scenario');
    console.log('');
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Is the server running? Start it with: npm start');
  }
}

// Check if server is running
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000', (res) => {
      req.abort();
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
  });
}

// Main
(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error('❌ ERROR: Server is not running!');
    console.error('');
    console.error('Please start the server first with: npm start');
    console.error('');
    process.exit(1);
  }
  
  console.log('✓ Server is running\n');
  
  await runTests();
})();
