# TradeTalents Deployment Guide

This guide provides instructions for deploying the TradeTalents application to production environments.

## Deployment Options

### Frontend Deployment

The frontend can be deployed to any static hosting service:

1. **Vercel** (Recommended)
2. **Netlify**
3. **GitHub Pages**
4. **AWS S3 + CloudFront**
5. **Google Cloud Storage**

### Backend Deployment

The backend can be deployed to any Node.js hosting service:

1. **Heroku** (Recommended for simplicity)
2. **DigitalOcean App Platform**
3. **AWS Elastic Beanstalk**
4. **Google Cloud Run**
5. **Azure App Service**

## Prerequisites

1. MongoDB Atlas cluster (see [MongoDB Atlas Setup Guide](../MONGODB_ATLAS_SETUP.md))
2. Domain names for frontend and backend (optional but recommended)
3. SSL certificates (provided by most hosting platforms)

## Frontend Deployment (Vercel - Recommended)

### 1. Prepare for Deployment

1. Build the production version locally to test:
   ```bash
   cd frontend
   npm run build
   ```

2. Verify the build works:
   ```bash
   npm run preview
   ```

### 2. Deploy to Vercel

1. Sign up for a [Vercel](https://vercel.com/) account
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Deploy from the frontend directory:
   ```bash
   cd frontend
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? Yes
   - Which scope? Your Vercel account
   - Link to existing project? No
   - What's your project's name? tradetalents-frontend
   - In which directory is your code located? ./
   - Want to override the settings? No

5. Configure environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `VITE_API_URL` with your backend URL

### 3. Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Backend Deployment (Heroku - Recommended)

### 1. Prepare for Deployment

1. Ensure your [.env](file:///c:/Users/yasha/OneDrive/Desktop/TradeTalents/backend/.env) file is properly configured with MongoDB Atlas connection
2. Test the application locally:
   ```bash
   cd backend
   npm run dev
   ```

### 2. Deploy to Heroku

#### Using Heroku CLI

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Log in to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   cd backend
   heroku create tradetalents-backend
   ```

4. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_production_jwt_secret
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   ```

5. Deploy the application:
   ```bash
   git push heroku main
   ```

#### Using GitHub Integration

1. Push your code to GitHub
2. Create a new app in Heroku dashboard
3. Connect to GitHub repository
4. Enable automatic deploys
5. Set environment variables in Heroku dashboard

### 3. Custom Domain (Optional)

1. In Heroku dashboard, go to your app
2. Navigate to Settings > Domains
3. Add your custom domain
4. Configure DNS with your domain provider

## Environment Variables

### Backend

Set these environment variables in your production environment:

```env
NODE_ENV=production
PORT=process.env.PORT || 5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_production_jwt_secret_key
```

### Frontend

Set these environment variables in your frontend deployment platform:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Database Migration

If you're migrating from a local MongoDB instance to MongoDB Atlas:

1. Export data from local database:
   ```bash
   mongodump --db tradetalents
   ```

2. Import data to MongoDB Atlas:
   ```bash
   mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net/tradetalents" dump/tradetalents
   ```

## SSL Configuration

Most hosting platforms provide automatic SSL certificates:

- **Vercel**: Automatic HTTPS for all deployments
- **Heroku**: Automatic SSL for paid dynos, manual setup for free tier
- **Netlify**: Automatic SSL certificates

For custom domains, you may need to configure DNS records as instructed by your hosting provider.

## Monitoring and Logging

### Backend

1. **Heroku Logs**:
   ```bash
   heroku logs --tail
   ```

2. **Application Performance Monitoring**:
   - Consider integrating with services like New Relic or Datadog

### Frontend

1. **Error Tracking**:
   - Consider integrating with Sentry for frontend error tracking

## Scaling

### Backend

For increased traffic:

1. **Vertical Scaling**: Upgrade to higher tier dynos (Heroku)
2. **Horizontal Scaling**: Use load balancers and multiple instances
3. **Database**: Upgrade MongoDB Atlas tier

### Frontend

Static sites typically scale automatically with traffic.

## Backup and Recovery

### Database Backups

MongoDB Atlas provides automatic backups:

1. Navigate to your cluster in Atlas dashboard
2. Go to Backup tab
3. Configure backup schedule
4. Restore from snapshots when needed

### Code Backups

1. Use version control (Git)
2. Push to multiple remotes (GitHub, GitLab, Bitbucket)
3. Consider automated backups to cloud storage

## Security Considerations

### Backend

1. Use strong, unique passwords for all services
2. Rotate JWT secrets regularly
3. Implement rate limiting
4. Use environment variables for sensitive data
5. Keep dependencies updated

### Frontend

1. Validate all user inputs
2. Sanitize data before displaying
3. Implement Content Security Policy (CSP)
4. Use HTTPS for all communications

## Troubleshooting

### Common Issues

1. **Application crashes**: Check logs for error messages
2. **Database connection failures**: Verify MongoDB Atlas connection string and network access
3. **CORS errors**: Ensure backend CORS configuration allows your frontend domain
4. **Environment variables not set**: Verify all required environment variables are configured

### Monitoring

1. Set up uptime monitoring (e.g., UptimeRobot)
2. Configure error tracking
3. Monitor database performance
4. Set up alerts for critical issues

## Maintenance

### Regular Tasks

1. Update dependencies regularly:
   ```bash
   npm outdated
   npm update
   ```

2. Monitor application performance
3. Review and rotate secrets
4. Check backup status

### Updates

1. Test updates in staging environment first
2. Deploy during low-traffic periods
3. Monitor application after updates
4. Have rollback plan ready

## Support

For deployment issues:

1. Check hosting platform documentation
2. Review application logs
3. Consult this deployment guide
4. Open an issue on the repository if you find bugs