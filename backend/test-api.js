// Simple test script to verify backend API endpoints
const axios = require('axios');

const baseURL = 'http://localhost:5000/api';

// Test health endpoint
async function testHealth() {
  try {
    const response = await axios.get(`${baseURL}/health`);
    console.log('Health check:', response.data);
  } catch (error) {
    console.error('Health check failed:', error.message);
  }
}

// Test registration
async function testRegister() {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      university: 'Test University'
    });
    console.log('Registration successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
}

// Test login
async function testLogin() {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
}

// Test get profile (requires authentication)
async function testGetProfile(token) {
  try {
    const response = await axios.get(`${baseURL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Profile retrieved:', response.data);
  } catch (error) {
    console.error('Get profile failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('Testing backend API endpoints...\n');
  
  await testHealth();
  console.log('');
  
  // Try login first, if it fails then register
  let token = await testLogin();
  console.log('');
  
  if (!token) {
    token = await testRegister();
    console.log('');
  }
  
  if (token) {
    await testGetProfile(token);
  }
}

runTests();