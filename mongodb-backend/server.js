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
const POSTS_COLLECTION = 'community_posts';

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

// ===== COMMUNITY POSTS ENDPOINTS =====

// Create new post
app.post('/api/posts', async (req, res) => {
  try {
    const postData = req.body;
    
    // Validate required fields
    if (!postData.title || !postData.content || !postData.author || !postData.authorId || !postData.category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: title, content, author, authorId, category' 
      });
    }
    
    // Set default values
    postData.createdAt = new Date();
    postData.updatedAt = new Date();
    postData.likes = postData.likes || 0;
    
    // Ensure content is an array
    if (typeof postData.content === 'string') {
      postData.content = [postData.content];
    }

    const result = await db.collection(POSTS_COLLECTION).insertOne(postData);
    console.log('✅ Post created successfully:', postData._id, 'by', postData.author);
    res.json({ success: true, post: postData, insertedId: result.insertedId });
  } catch (error) {
    console.error('❌ Error creating post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all posts (with optional category filter)
app.get('/api/posts', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const posts = await db.collection(POSTS_COLLECTION)
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`Posts fetched: ${posts.length} posts${category ? ` in category: ${category}` : ''}`);
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific post by ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.collection(POSTS_COLLECTION).findOne({ _id: id });
    
    if (post) {
      console.log('Post found:', id);
      res.json({ success: true, post });
    } else {
      console.log('Post not found:', id);
      res.json({ success: true, post: null });
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update post likes
app.put('/api/posts/:id/likes', async (req, res) => {
  try {
    const { id } = req.params;
    const { increment } = req.body; // true to increment, false to decrement
    
    const updateOperation = increment 
      ? { $inc: { likes: 1 } }
      : { $inc: { likes: -1 } };
    
    const result = await db.collection(POSTS_COLLECTION).findOneAndUpdate(
      { _id: id },
      { 
        ...updateOperation,
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );

    if (result.value) {
      console.log('Post likes updated:', id, 'New likes:', result.value.likes);
      res.json({ success: true, post: result.value });
    } else {
      res.status(404).json({ success: false, error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error updating post likes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete post (optional - for moderation)
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection(POSTS_COLLECTION).deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      console.log('Post deleted:', id);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get posts statistics (must be before /api/posts/:id)
app.get('/api/posts/stats', async (req, res) => {
  try {
    const totalPosts = await db.collection(POSTS_COLLECTION).countDocuments();
    
    const categoryStats = await db.collection(POSTS_COLLECTION).aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]).toArray();
    
    const totalLikes = await db.collection(POSTS_COLLECTION).aggregate([
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$likes' }
        }
      }
    ]).toArray();
    
    console.log('Posts statistics requested');
    res.json({ 
      success: true, 
      stats: {
        totalPosts,
        totalLikes: totalLikes[0]?.totalLikes || 0,
        categoryBreakdown: categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching posts statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get posts by author
app.get('/api/posts/author/:authorId', async (req, res) => {
  try {
    const { authorId } = req.params;
    const posts = await db.collection(POSTS_COLLECTION)
      .find({ authorId })
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`Posts by author ${authorId}: ${posts.length} posts`);
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear test posts (development only)
app.delete('/api/posts/test/clear', async (req, res) => {
  try {
    const result = await db.collection(POSTS_COLLECTION).deleteMany({ 
      _id: { $regex: /^test_post_/ } 
    });
    
    console.log(`Cleared ${result.deletedCount} test posts`);
    res.json({ 
      success: true, 
      message: `Cleared ${result.deletedCount} test posts` 
    });
  } catch (error) {
    console.error('Error clearing test posts:', error);
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
