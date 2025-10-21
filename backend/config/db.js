const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Extract database name from URI or use default
    const uri = process.env.MONGODB_URI;
    const dbName = uri.split('/').pop().split('?')[0] || 'tradetalents';
    
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log(`Connection URI: ${uri}`);
    console.log(`Database name: ${dbName}`);
    
    const conn = await mongoose.connect(uri, {
      dbName: dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Connection readyState: ${conn.connection.readyState}`);
  } catch (error) {
    console.error('MongoDB Connection Error:');
    console.error(`Error Code: ${error.code}`);
    console.error(`Error Message: ${error.message}`);
    
    // Provide specific troubleshooting guidance based on error
    if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.error('\n--- AUTHENTICATION ERROR ---');
      console.error('This error indicates that the database user credentials are incorrect or the user lacks proper permissions.');
      console.error('To fix this issue:');
      console.error('1. Go to MongoDB Atlas dashboard');
      console.error('2. Navigate to Database Access section');
      console.error('3. Find the database user (yashasvi)');
      console.error('4. Ensure the user has "Atlas admin" or "Read and write to any database" role');
      console.error('5. Verify the password is correct');
      console.error('6. Update the MONGODB_URI in your .env file with correct credentials');
      console.error('---------------------------\n');
    } else if (error.message.includes('insert') && error.message.includes('not allowed')) {
      console.error('\n--- PERMISSION ERROR ---');
      console.error('This error indicates that the database user does not have permission to perform write operations.');
      console.error('To fix this issue:');
      console.error('1. Go to MongoDB Atlas dashboard');
      console.error('2. Navigate to Database Access section');
      console.error('3. Find the database user (yashasvi)');
      console.error('4. Edit the user and assign "Atlas admin" or "Read and write to any database" role');
      console.error('-----------------------\n');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;