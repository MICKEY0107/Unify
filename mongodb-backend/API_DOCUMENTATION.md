# Community Posts API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Create Post
**POST** `/posts`

Creates a new community post.

**Request Body:**
```json
{
  "_id": "unique_post_id",
  "title": "Post Title",
  "subtitle": "Optional subtitle",
  "content": ["Paragraph 1", "Paragraph 2"],
  "author": "Display Name",
  "authorId": "user_uid",
  "authorCustomUsername": "custom_username",
  "authorProfileImage": "https://image-url.com/avatar.jpg",
  "category": "General",
  "image": "https://image-url.com/cover.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "post": { /* post object */ },
  "insertedId": "mongodb_object_id"
}
```

### 2. Get All Posts
**GET** `/posts`

Retrieves all posts, optionally filtered by category.

**Query Parameters:**
- `category` (optional): Filter posts by category

**Examples:**
- `/posts` - Get all posts
- `/posts?category=Mental Health` - Get posts in Mental Health category

**Response:**
```json
{
  "success": true,
  "posts": [
    { /* post object */ }
  ]
}
```

### 3. Get Post by ID
**GET** `/posts/:id`

Retrieves a specific post by its ID.

**Response:**
```json
{
  "success": true,
  "post": { /* post object or null */ }
}
```

### 4. Update Post Likes
**PUT** `/posts/:id/likes`

Increments or decrements the likes count for a post.

**Request Body:**
```json
{
  "increment": true  // true to add like, false to remove like
}
```

**Response:**
```json
{
  "success": true,
  "post": { /* updated post object */ }
}
```

### 5. Get Posts by Author
**GET** `/posts/author/:authorId`

Retrieves all posts by a specific author.

**Response:**
```json
{
  "success": true,
  "posts": [
    { /* post objects by author */ }
  ]
}
```

### 6. Get Posts Statistics
**GET** `/posts/stats`

Retrieves statistics about all posts.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalPosts": 42,
    "totalLikes": 156,
    "categoryBreakdown": [
      { "_id": "Mental Health", "count": 15 },
      { "_id": "General", "count": 12 }
    ]
  }
}
```

### 7. Delete Post
**DELETE** `/posts/:id`

Deletes a specific post (for moderation purposes).

**Response:**
```json
{
  "success": true
}
```

## Post Object Structure

```json
{
  "_id": "unique_post_id",
  "title": "Post Title",
  "subtitle": "Optional subtitle",
  "content": ["Array of paragraphs"],
  "image": "Cover image URL (optional)",
  "author": "Display name",
  "authorId": "User UID",
  "authorCustomUsername": "Custom username (optional)",
  "authorProfileImage": "Profile image URL (optional)",
  "category": "Post category",
  "likes": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Categories

Available categories:
- Communication
- Physical & Mobility
- Cognitive & Learning
- Visual
- Hearing
- Mental Health
- General

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (missing required fields)
- `404` - Not Found (post doesn't exist)
- `500` - Internal Server Error

## Testing

Run the test script to verify all endpoints:

```bash
node test-api.js
```

Make sure the server is running first:

```bash
node server.js
```