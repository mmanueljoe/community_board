# CommunityBoard API Contract Specification
## REST API Design (Backend Contract)

**Purpose:** Define exact API contract you'll build frontend against
**Status:** Specifications for mock implementation (will integrate with real backend)
**Authorization:** JWT Bearer Token in Authorization header

---

## AUTHENTICATION ENDPOINTS

### POST /auth/register
**Purpose:** Create new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Request Validation (Client-Side):**
- `email`: Required, valid email format
- `password`: Required, min 8 chars, must contain uppercase + lowercase + number
- `name`: Required, min 2 chars, max 100 chars

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already registered",
    "details": {
      "email": "Email already in use"
    }
  }
}
```

**Status Codes:**
- `201`: Created successfully
- `400`: Validation error (see details)
- `409`: Conflict (email exists)
- `500`: Server error

---

### POST /auth/login
**Purpose:** Authenticate user and get JWT token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Invalid credentials
- `404`: User not found
- `500`: Server error

---

### GET /auth/me
**Purpose:** Get current authenticated user (verify token)

**Authorization Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Invalid/expired token
- `500`: Server error

---

## POST ENDPOINTS

### POST /api/posts
**Purpose:** Create a new post

**Authorization:** Required (Bearer token)

**Request:**
```json
{
  "title": "New Community Center Opening",
  "content": "We're excited to announce the opening of our new community center in downtown...",
  "category": "NEWS"
}
```

**Request Validation:**
- `title`: Required, min 5 chars, max 200 chars
- `content`: Required, min 10 chars, max 5000 chars
- `category`: Required, one of: NEWS, EVENT, DISCUSSION, ALERT

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "title": "New Community Center Opening",
    "content": "We're excited to announce...",
    "category": "NEWS",
    "authorId": "user-uuid",
    "author": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "commentCount": 0,
    "imageUrl": null
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": {
      "title": "Title too short (min 5 chars)"
    }
  }
}
```

**Status Codes:**
- `201`: Created
- `400`: Validation error
- `401`: Unauthorized
- `500`: Server error

---

### GET /api/posts
**Purpose:** Get list of posts with filtering and pagination

**Authorization:** Optional (works without token, but shows user's own posts if logged in)

**Query Parameters:**
```
GET /api/posts?category=NEWS&keyword=community&page=1&pageSize=20&startDate=2024-01-01&endDate=2024-12-31
```

**Parameters:**
- `category`: Filter by category (NEWS, EVENT, DISCUSSION, ALERT) - optional
- `keyword`: Search in title and content - optional
- `page`: Page number (1-based) - default: 1
- `pageSize`: Posts per page - default: 20, max: 100
- `startDate`: Filter posts created after this date (ISO 8601) - optional
- `endDate`: Filter posts created before this date (ISO 8601) - optional
- `sortBy`: Sort field (createdAt, updatedAt, commentCount) - default: createdAt
- `sortOrder`: asc or desc - default: desc

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "post-uuid-1",
      "title": "New Community Center Opening",
      "content": "We're excited to announce...",
      "category": "NEWS",
      "authorId": "user-uuid",
      "author": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "user@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "commentCount": 5,
      "imageUrl": null
    },
    {
      "id": "post-uuid-2",
      "title": "Community Cleanup Event",
      "content": "Join us for our monthly cleanup...",
      "category": "EVENT",
      "authorId": "user-uuid-2",
      "author": {
        "id": "user-uuid-2",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "createdAt": "2024-01-14T15:45:00Z",
      "updatedAt": "2024-01-14T15:45:00Z",
      "commentCount": 12,
      "imageUrl": null
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid query parameters",
    "details": {
      "category": "Category must be one of: NEWS, EVENT, DISCUSSION, ALERT"
    }
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid parameters
- `500`: Server error

---

### GET /api/posts/:id
**Purpose:** Get single post with all details and comments

**Authorization:** Optional

**URL Parameters:**
- `id`: Post UUID (required)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "title": "New Community Center Opening",
    "content": "We're excited to announce the opening of our new community center in downtown...",
    "category": "NEWS",
    "authorId": "user-uuid",
    "author": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "commentCount": 5,
    "imageUrl": null,
    "comments": [
      {
        "id": "comment-uuid-1",
        "text": "Great news! Looking forward to visiting.",
        "authorId": "user-uuid-2",
        "author": {
          "id": "user-uuid-2",
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "createdAt": "2024-01-15T12:00:00Z",
        "updatedAt": "2024-01-15T12:00:00Z"
      },
      {
        "id": "comment-uuid-2",
        "text": "When does it open?",
        "authorId": "user-uuid-3",
        "author": {
          "id": "user-uuid-3",
          "name": "Bob Wilson",
          "email": "bob@example.com"
        },
        "createdAt": "2024-01-15T13:30:00Z",
        "updatedAt": "2024-01-15T13:30:00Z"
      }
    ]
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Post not found"
  }
}
```

**Status Codes:**
- `200`: Success
- `404`: Post not found
- `500`: Server error

---

### PUT /api/posts/:id
**Purpose:** Update post (author or admin only)

**Authorization:** Required

**URL Parameters:**
- `id`: Post UUID (required)

**Request:**
```json
{
  "title": "Updated: New Community Center Opening",
  "content": "Updated content...",
  "category": "NEWS"
}
```

**All fields optional** (only send what you're updating)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "title": "Updated: New Community Center Opening",
    "content": "Updated content...",
    "category": "NEWS",
    "authorId": "user-uuid",
    "author": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:45:00Z",
    "commentCount": 5,
    "imageUrl": null
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Only post author or admin can update this post"
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Validation error
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (not author/admin)
- `404`: Post not found
- `500`: Server error

---

### DELETE /api/posts/:id
**Purpose:** Delete post (author or admin only)

**Authorization:** Required

**URL Parameters:**
- `id`: Post UUID (required)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Post deleted successfully"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Only post author or admin can delete this post"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Post not found
- `500`: Server error

---

## COMMENT ENDPOINTS

### POST /api/posts/:postId/comments
**Purpose:** Add comment to a post

**Authorization:** Required

**URL Parameters:**
- `postId`: Post UUID (required)

**Request:**
```json
{
  "text": "This is a great post! Looking forward to more updates."
}
```

**Request Validation:**
- `text`: Required, min 1 char, max 1000 chars

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "comment-uuid",
    "postId": "post-uuid",
    "text": "This is a great post! Looking forward to more updates.",
    "authorId": "user-uuid",
    "author": {
      "id": "user-uuid",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "createdAt": "2024-01-15T14:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Post not found"
  }
}
```

**Status Codes:**
- `201`: Created
- `400`: Validation error
- `401`: Unauthorized
- `404`: Post not found
- `500`: Server error

---

### GET /api/posts/:postId/comments
**Purpose:** Get all comments for a post (paginated)

**Authorization:** Optional

**URL Parameters:**
- `postId`: Post UUID (required)

**Query Parameters:**
- `page`: Page number (1-based) - default: 1
- `pageSize`: Comments per page - default: 50

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "comment-uuid-1",
      "postId": "post-uuid",
      "text": "Great post!",
      "authorId": "user-uuid",
      "author": {
        "id": "user-uuid",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "createdAt": "2024-01-15T12:00:00Z",
      "updatedAt": "2024-01-15T12:00:00Z"
    },
    {
      "id": "comment-uuid-2",
      "postId": "post-uuid",
      "text": "Thanks for sharing!",
      "authorId": "user-uuid-2",
      "author": {
        "id": "user-uuid-2",
        "name": "Bob Wilson",
        "email": "bob@example.com"
      },
      "createdAt": "2024-01-15T13:30:00Z",
      "updatedAt": "2024-01-15T13:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pageSize": 50,
    "totalPages": 1
  }
}
```

**Status Codes:**
- `200`: Success
- `404`: Post not found
- `500`: Server error

---

### DELETE /api/comments/:id
**Purpose:** Delete comment (author or admin only)

**Authorization:** Required

**URL Parameters:**
- `id`: Comment UUID (required)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Comment deleted successfully"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Only comment author or admin can delete this comment"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Comment not found
- `500`: Server error

---

## ANALYTICS ENDPOINTS

### GET /api/analytics
**Purpose:** Get aggregated analytics data for dashboard

**Authorization:** Optional (public endpoint, might want admin-only later)

**Query Parameters:**
- `startDate`: Filter data from this date (ISO 8601) - optional
- `endDate`: Filter data to this date (ISO 8601) - optional

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPosts": 156,
      "totalComments": 487,
      "totalUsers": 34,
      "totalCategories": 4
    },
    "postsByCategory": {
      "NEWS": 45,
      "EVENT": 38,
      "DISCUSSION": 52,
      "ALERT": 21
    },
    "activityByDay": [
      {
        "date": "2024-01-15",
        "postCount": 12,
        "commentCount": 34
      },
      {
        "date": "2024-01-14",
        "postCount": 8,
        "commentCount": 22
      },
      {
        "date": "2024-01-13",
        "postCount": 15,
        "commentCount": 40
      }
    ],
    "topContributors": [
      {
        "id": "user-uuid-1",
        "name": "John Doe",
        "email": "john@example.com",
        "postCount": 12
      },
      {
        "id": "user-uuid-2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "postCount": 10
      },
      {
        "id": "user-uuid-3",
        "name": "Bob Wilson",
        "email": "bob@example.com",
        "postCount": 8
      },
      {
        "id": "user-uuid-4",
        "name": "Alice Brown",
        "email": "alice@example.com",
        "postCount": 7
      },
      {
        "id": "user-uuid-5",
        "name": "Charlie Davis",
        "email": "charlie@example.com",
        "postCount": 6
      }
    ],
    "mostActiveDay": {
      "day": "Monday",
      "postCount": 34,
      "commentCount": 89
    }
  }
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

## ERROR RESPONSE FORMAT

All errors follow this standard format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {
      "field1": "Field-specific error",
      "field2": "Another field error"
    }
  }
}
```

**Standard Error Codes:**
- `VALIDATION_ERROR` — Request validation failed
- `UNAUTHORIZED` — Missing or invalid token
- `FORBIDDEN` — Access denied (auth check passed but user doesn't have permission)
- `NOT_FOUND` — Resource not found
- `CONFLICT` — Resource already exists (e.g., email taken)
- `BAD_REQUEST` — Malformed request
- `INTERNAL_SERVER_ERROR` — Server error

---

## AUTHENTICATION

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Token Contents (Claims):**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1516239022,
  "exp": 1516325422
}
```

**Token Expiry:** 24 hours (subject to change)

**How to use:**
```javascript
// In axios interceptor
const token = localStorage.getItem('token');
config.headers.Authorization = `Bearer ${token}`;
```

---

## TEST DATA (Default Credentials)

Use for mock testing:

```
Admin User:
  Email: admin@amalitech.com
  Password: password123

Regular User:
  Email: user@amalitech.com
  Password: password123
```

---

## API SUMMARY TABLE

| Method | Endpoint | Purpose | Auth | Returns |
|--------|----------|---------|------|---------|
| POST | /auth/register | Create account | No | 201 with user + token |
| POST | /auth/login | Login | No | 200 with user + token |
| GET | /auth/me | Verify token | Yes | 200 with user |
| POST | /api/posts | Create post | Yes | 201 with post |
| GET | /api/posts | List posts | No | 200 with posts array |
| GET | /api/posts/:id | Get post detail | No | 200 with post + comments |
| PUT | /api/posts/:id | Update post | Yes | 200 with updated post |
| DELETE | /api/posts/:id | Delete post | Yes | 200 success message |
| POST | /api/posts/:postId/comments | Add comment | Yes | 201 with comment |
| GET | /api/posts/:postId/comments | Get comments | No | 200 with comments |
| DELETE | /api/comments/:id | Delete comment | Yes | 200 success message |
| GET | /api/analytics | Get dashboard data | No | 200 with analytics |

---

## IMPLEMENTATION NOTES FOR FRONTEND

### 1. Error Handling
Always check `success` field first:

```javascript
try {
  const response = await axios.get('/api/posts');
  if (response.data.success) {
    // Use response.data.data
  } else {
    // Handle error from response.data.error
  }
} catch (error) {
  // Handle network error
}
```

### 2. Pagination
Posts and comments use pagination:

```javascript
// Request
GET /api/posts?page=2&pageSize=20

// Response includes
pagination: {
  total: 156,
  page: 2,
  pageSize: 20,
  totalPages: 8
}
```

### 3. Filtering
Posts support multiple filters simultaneously:

```javascript
GET /api/posts?category=NEWS&keyword=community&startDate=2024-01-01&endDate=2024-12-31
```

### 4. Authorization Checks
Some actions check authorization:
- Only post author or ADMIN can edit/delete post
- Only comment author or ADMIN can delete comment

Frontend should:
1. Show edit/delete buttons only if user is author/admin
2. Handle 403 Forbidden gracefully if user tries anyway
3. Never rely solely on button visibility (backend validates)

### 5. Timestamps
All timestamps are ISO 8601 format:
```
2024-01-15T10:30:00Z
```

Parse with:
```javascript
new Date('2024-01-15T10:30:00Z')
```

---

## COORDINATION WITH BACKEND

**Before implementation starts, confirm with backend engineer (Bruce):**

- [ ] Endpoint paths match exactly
- [ ] Request/response shapes match
- [ ] Error codes and formats match
- [ ] Authentication mechanism (JWT in Authorization header) is correct
- [ ] Token format and contents match
- [ ] Pagination strategy (page-based) matches
- [ ] Timestamp formats (ISO 8601) match
- [ ] Status codes match expectations
- [ ] Default test credentials work

---

This is your single source of truth for API contract. Reference this when building the mock API and when integrating with real backend.
