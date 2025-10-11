// Test script for Community Posts API
// Run this after starting the server to test the endpoints

const API_BASE = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Community Posts API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);

    // Test 2: Create a test post
    console.log('\n2️⃣ Testing Post Creation...');
    const testPost = {
      _id: `test_post_${Date.now()}`,
      title: 'Test Community Post',
      subtitle: 'This is a test post',
      content: ['This is the first paragraph.', 'This is the second paragraph.'],
      author: 'Test User',
      authorId: 'test_user_123',
      authorCustomUsername: 'testuser',
      authorProfileImage: 'https://example.com/avatar.jpg',
      category: 'General',
      image: 'https://example.com/test-image.jpg'
    };

    const createResponse = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPost)
    });
    const createData = await createResponse.json();
    
    if (createData.success) {
      console.log('✅ Post Created:', createData.post.title);
      
      // Test 3: Get all posts
      console.log('\n3️⃣ Testing Get All Posts...');
      const getAllResponse = await fetch(`${API_BASE}/api/posts`);
      const getAllData = await getAllResponse.json();
      console.log('✅ Posts Retrieved:', getAllData.posts.length, 'posts');

      // Test 4: Get post by ID
      console.log('\n4️⃣ Testing Get Post by ID...');
      const getByIdResponse = await fetch(`${API_BASE}/api/posts/${testPost._id}`);
      const getByIdData = await getByIdResponse.json();
      
      if (getByIdData.success && getByIdData.post) {
        console.log('✅ Post Retrieved by ID:', getByIdData.post.title);
      } else {
        console.log('❌ Post not found by ID');
      }

      // Test 5: Update likes
      console.log('\n5️⃣ Testing Like Update...');
      const likeResponse = await fetch(`${API_BASE}/api/posts/${testPost._id}/likes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: true })
      });
      const likeData = await likeResponse.json();
      
      if (likeData.success) {
        console.log('✅ Likes Updated:', likeData.post.likes, 'likes');
      }

      // Test 6: Get posts by category
      console.log('\n6️⃣ Testing Category Filter...');
      const categoryResponse = await fetch(`${API_BASE}/api/posts?category=General`);
      const categoryData = await categoryResponse.json();
      console.log('✅ Posts in General category:', categoryData.posts.length);

      // Test 7: Get posts statistics
      console.log('\n7️⃣ Testing Statistics...');
      const statsResponse = await fetch(`${API_BASE}/api/posts/stats`);
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        console.log('✅ Statistics:', {
          totalPosts: statsData.stats.totalPosts,
          totalLikes: statsData.stats.totalLikes,
          categories: statsData.stats.categoryBreakdown.length
        });
      }

      console.log('\n🎉 All tests completed successfully!');
    } else {
      console.log('❌ Failed to create test post:', createData.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: node server.js');
  }
}

// Run tests
testAPI();