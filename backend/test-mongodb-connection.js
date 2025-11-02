const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    
    // Hide password in logs for security
    const uriWithoutPassword = process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@');
    console.log('Connection string (password hidden):', uriWithoutPassword);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5001, // Timeout after 5s instead of 30s
    });

    console.log('✅ MongoDB Connection Successful!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Error Message: ${error.message}`);
    
    if (error.message.includes('Authentication failed')) {
      console.error('\n🔧 TROUBLESHOOTING TIPS:');
      console.error('   1. Check that you have replaced YOUR_ACTUAL_PASSWORD in the .env file');
      console.error('   2. Verify the username and password are correct in MongoDB Atlas');
      console.error('   3. Ensure the user has proper database access permissions');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n🔧 TROUBLESHOOTING TIPS:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify the MongoDB URI is correct');
      console.error('   3. Ensure your IP is whitelisted in MongoDB Atlas Network Access');
    }
    
    process.exit(1);
  }
};

testConnection();