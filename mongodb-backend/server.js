// MongoDB Backend Service
// This is a separate Node.js service that handles MongoDB operations
// Deploy this to Heroku, Vercel, or any Node.js hosting service

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://goraprsggg_db_user:4j75BLsKG1hr7kBg@cluster0.vuklamq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'unify';
const COLLECTION_NAME = 'users';

let db;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Routes
app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    userData.createdAt = new Date();
    userData.updatedAt = new Date();

    const result = await db.collection(COLLECTION_NAME).insertOne(userData);
    console.log('User created:', userData.uid);
    res.json({ success: true, user: userData, insertedId: result.insertedId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await db.collection(COLLECTION_NAME).findOne({ uid });
    
    if (user) {
      console.log('User found:', uid);
      res.json({ success: true, user });
    } else {
      console.log('User not found:', uid);
      res.json({ success: true, user: null });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
      { uid },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (result.value) {
      console.log('User updated:', uid);
      res.json({ success: true, user: result.value });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await db.collection(COLLECTION_NAME).deleteOne({ uid });

    if (result.deletedCount > 0) {
      console.log('User deleted:', uid);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/users/check-username', async (req, res) => {
  try {
    const { username, excludeUid } = req.body;
    const filter = { customUsername: username };
    
    if (excludeUid) {
      filter.uid = { $ne: excludeUid };
    }

    const existingUser = await db.collection(COLLECTION_NAME).findOne(filter);
    const isAvailable = !existingUser;

    console.log(`Username "${username}" is ${isAvailable ? 'available' : 'taken'}`);
    res.json({ success: true, available: isAvailable });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MongoDB API is running' });
});

// Start server
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`MongoDB API server running on port ${PORT}`);
  });
});

module.exports = app;
