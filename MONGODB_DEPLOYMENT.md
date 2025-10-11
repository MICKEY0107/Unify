# MongoDB Backend Deployment Guide

This guide explains how to deploy the MongoDB backend service to make it work with your React Native app.

## Quick Setup (Heroku)

### 1. Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Deploy to Heroku
```bash
cd mongodb-backend
heroku create unify-mongodb-api
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### 3. Update API URL
In `services/mongoDBService.ts`, update the API_BASE_URL:
```typescript
const API_BASE_URL = 'https://unify-mongodb-api.herokuapp.com';
```

## Alternative: Vercel Deployment

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
cd mongodb-backend
vercel
```

### 3. Update API URL
```typescript
const API_BASE_URL = 'https://your-project.vercel.app';
```

## Testing the API

### Health Check
```bash
curl https://your-api-url.herokuapp.com/api/health
```

### Create User
```bash
curl -X POST https://your-api-url.herokuapp.com/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "test123",
    "email": "test@example.com",
    "displayName": "Test User"
  }'
```

## Current Status

Right now, the app uses **local storage simulation** with detailed MongoDB operation logging. You'll see:

- 🔵 **MONGODB OPERATIONS**: What would be sent to MongoDB
- ✅ **SUCCESS MESSAGES**: When operations complete
- 🔄 **FALLBACK NOTICES**: When using local storage

## What You'll See in Console

```
🔵 MONGODB INSERT: {
  "collection": "users",
  "database": "unify", 
  "document": {
    "uid": "TMXSh5iWuYNDVXFFVBQd6Wgi7U23",
    "email": "user@gmail.com",
    "displayName": "John Doe",
    "customUsername": "johndoe",
    "profileImageUrl": "https://i.ibb.co/hxxntKYc/2fa7f691b17a.png",
    "createdAt": "2024-01-10T16:25:10.380Z",
    "updatedAt": "2024-01-10T16:25:10.380Z"
  }
}
📡 Would send to MongoDB Atlas: INSERT
🗄️ Database: unify, Collection: users
✅ User created in local storage (MongoDB simulation): TMXSh5iWuYNDVXFFVBQd6Wgi7U23
```

## Next Steps

1. **Deploy the backend** using one of the methods above
2. **Update the API URL** in the service
3. **Test the connection** - users will be created in MongoDB Atlas
4. **Verify in MongoDB Atlas** - check your cluster for the new users

## Troubleshooting

### API Not Working
- Check if the backend is deployed correctly
- Verify the API URL is correct
- Check Heroku/Vercel logs for errors

### MongoDB Connection Issues
- Verify your MongoDB connection string
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database and collection exist

### Sign Out Issues
- Fixed the Firebase signOut naming conflict
- Sign out should now work properly and redirect to login
