# MongoDB Atlas Setup Guide

This guide will walk you through setting up MongoDB Atlas for the TradeTalents application.

## Prerequisites

- A valid email address
- Internet access

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign Up"
3. Enter your email, first name, last name, and password
4. Click "Create Account"
5. Verify your email address by clicking the link sent to your email

## Step 2: Create a New Cluster

1. After logging in, click "Build a Database"
2. Select the **FREE** tier (M0 Sandbox):
   - Provider: Choose AWS, GCP, or Azure
   - Region: Select the region closest to your users
   - Cluster Tier: M0 Sandbox (Free forever)
   - Cluster Name: Enter "TradeTalents" or leave as default
3. Click "Create Cluster"

## Step 3: Configure Database Access

1. In the left sidebar, click "Database Access" under the Security section
2. Click "Add New Database User"
3. Fill in the form:
   - Authentication Method: Password
   - Username: `tradetalents_user` (or your preferred username)
   - Password: Click "Autogenerate Secure Password" or enter your own secure password
   - User Privileges: Select "Atlas Admin" (for development) or "Read and Write to any database" (for production)
4. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click "Network Access" under the Security section
2. Click "Add IP Address"
3. For development:
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Add a comment like "Development access"
   - Click "Confirm"
4. For production:
   - Click "Add Current IP Address" to add your current IP
   - Or manually enter the IP address of your server
   - Add a descriptive comment
   - Click "Confirm"

## Step 5: Get Connection String

1. Go back to your cluster by clicking "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Choose "Node.js" as the driver and the latest version
5. Copy the connection string

## Step 6: Update Environment Variables

1. In your backend project, open the [.env](file:///c:/Users/yasha/OneDrive/Desktop/TradeTalents/backend/.env) file
2. Replace the `MONGODB_URI` value with your connection string:
   ```
   MONGODB_URI=mongodb+srv://tradetalents_user:<password>@cluster0.xxxxx.mongodb.net/tradetalents?retryWrites=true&w=majority
   ```
3. Replace `<password>` with the password you created for your database user
4. Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address
5. Save the file

## Step 7: Test the Connection

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```
2. Check the console output for "MongoDB Connected" message

## Troubleshooting

### Connection Issues

1. **ECONNREFUSED**: Make sure your cluster is not paused and network access is configured correctly
2. **Authentication failed**: Double-check your username and password
3. **IP not whitelisted**: Add your current IP address to the Network Access list

### Cluster Issues

1. **Cluster paused**: Clusters may pause after a period of inactivity on the free tier
2. **Slow performance**: Free tier clusters may have limited performance

## Security Best Practices

1. Never commit your connection string or credentials to version control
2. Use strong, unique passwords for database users
3. Limit IP access in production environments
4. Regularly rotate your database user passwords
5. Use environment variables for sensitive configuration

## Next Steps

1. Start your backend server
2. Test the API endpoints
3. Begin developing your application features

For more information, refer to the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/).