# CommunityBoard API Contract (Updated)
## Real Backend Endpoints from GitHub Starter Code

**Base URL:** `http://localhost:8080`  
**Auth Header:** `Authorization: Bearer <jwt>`

---

## AUTH ENDPOINTS

### POST /api/auth/register
```
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

### POST /api/auth/login
```
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

---

## CATEGORIES

### GET /api/categories
```
Response 200:
[
  { "id": 1, "name": "NEWS" },
  { "id": 2, "name": "EVENT" },
  { "id": 3, "name": "DISCUSSION" },
  { "id": 4, "name": "ALERT" }
]
```

---

## POSTS

### GET /api/posts
```
Query Params:
- page: int (default 0, 0-indexed)
- size: int (default 10)

Response 200 (Spring Page<PostResponse>):
{
  "content": [
    {
      "id": 1,
      "title": "New Community Center",
      "content": "We're excited to announce...",
      "categoryId": 1,
      "categoryName": "NEWS",
      "authorName": "John Doe",
      "authorEmail": "john@example.com",
      "createdAt": "2024-01-15T10:30:00",
      "updatedAt": "2024-01-15T10:30:00",
      "commentCount": 5
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": { ... }
  },
  "totalElements": 45,
  "totalPages": 5,
  "last": false,
  "first": true,
  "empty": false
}
```

**Note:** Posts sorted by createdAt DESC

### GET /api/posts/{id}
```
Path: id: Long

Response 200:
{
  "id": 1,
  "title": "New Community Center",
  "content": "We're excited to announce...",
  "categoryId": 1,
  "categoryName": "NEWS",
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00",
  "commentCount": 5
}
```

### POST /api/posts
```
Auth: Required (Bearer token)

Request:
{
  "title": "New Community Center",
  "content": "We're excited to announce our new community center...",
  "categoryId": 1
}

Response 200:
{
  "id": 1,
  "title": "New Community Center",
  "content": "We're excited to announce...",
  "categoryId": 1,
  "categoryName": "NEWS",
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00",
  "commentCount": 0
}
```

### PUT /api/posts/{id}
```
Auth: Required (Bearer token)
Path: id: Long

Request:
{
  "title": "Updated Title",
  "content": "Updated content...",
  "categoryId": 2
}

Response 200:
{
  "id": 1,
  "title": "Updated Title",
  "content": "Updated content...",
  "categoryId": 2,
  "categoryName": "EVENT",
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T12:00:00",
  "commentCount": 5
}
```

### DELETE /api/posts/{id}
```
Auth: Required (Bearer token)
Path: id: Long

Response 204 (No Content)
```

---

## COMMENTS

### GET /api/posts/{postId}/comments
```
Path: postId: Long

Response 200:
[
  {
    "id": 1,
    "content": "Great post!",
    "authorName": "Jane Smith",
    "createdAt": "2024-01-15T12:00:00"
  },
  {
    "id": 2,
    "content": "Thanks for sharing!",
    "authorName": "Bob Wilson",
    "createdAt": "2024-01-15T13:30:00"
  }
]
```

**Note:** Comments sorted by createdAt ASC (oldest first)

### POST /api/posts/{postId}/comments (NOT YET IMPLEMENTED)
```
Auth: Required (Bearer token)
Path: postId: Long

Request:
{
  "content": "Great post!"
}

Response 200:
{
  "id": 1,
  "content": "Great post!",
  "authorName": "Jane Smith",
  "createdAt": "2024-01-15T12:00:00"
}
```

**Status:** Endpoint not yet in backend - will be mocked in frontend

### DELETE /api/comments/{id} (NOT YET IMPLEMENTED)
```
Auth: Required (Bearer token)
Path: id: Long

Response 204 (No Content)
```

**Status:** Endpoint not yet in backend - will be mocked in frontend

---

## NOT YET IMPLEMENTED

These endpoints don't exist yet in backend. Build UI, mock data:

- **POST /api/posts/{postId}/comments** - Create comment
- **DELETE /api/comments/{id}** - Delete comment
- **GET /api/posts/search** - Search/filter posts
- **GET /api/analytics** - Dashboard analytics

Coordinate with backend to implement before you need them.

---

## KEY DIFFERENCES FROM ORIGINAL SPEC

1. **IDs are Long** (not UUID)
2. **Pagination:** page/size (0-indexed, not 1-indexed)
3. **POST response 200** (not 201)
4. **DELETE response 204** (not 200)
5. **Categories have IDs** (not just names)
6. **Spring Page wrapper** (not custom pagination)
7. **Comments sorted ASC** (not DESC)

---

## FRONTEND ASSUMPTIONS

For endpoints not yet implemented, frontend will:
1. Mock the data
2. Provide UI that works
3. Swap with real endpoint when backend is ready
4. **No code changes needed** (same interface)
