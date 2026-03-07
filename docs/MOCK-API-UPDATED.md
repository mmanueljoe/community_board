# Mock API Implementation (Updated for Real Backend)

**Key changes from original:**
- IDs are `Long` (not UUID)
- Pagination: 0-indexed page/size (Spring Page format)
- Categories have IDs
- Comment create/delete endpoints mocked (not in backend yet)
- No analytics endpoint (not in backend)

---

## Quick Copy-Paste Guide

### Mock Data Structure

```typescript
// Categories
const categories = [
  { id: 1, name: 'NEWS' },
  { id: 2, name: 'EVENT' },
  { id: 3, name: 'DISCUSSION' },
  { id: 4, name: 'ALERT' }
];

// Posts (50+ posts with long IDs)
const posts = [
  {
    id: 1,
    title: "New Community Center Opening",
    content: "...",
    categoryId: 1,
    categoryName: "NEWS",
    authorName: "John Doe",
    authorEmail: "john@example.com",
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-01-15T10:30:00",
    commentCount: 5
  },
  // ... 50+ more
];

// Comments (200+ comments)
const comments = [
  {
    id: 1,
    postId: 1,
    content: "Great post!",
    authorName: "Jane Smith",
    createdAt: "2024-01-15T12:00:00"
  },
  // ... 200+ more
];
```

---

## Mock API Functions

### Auth

```typescript
const mockAuthAPI = {
  register: async (data) => {
    // Validate: name, email (@Email), password (@Size min 6)
    // Return: { token, email, name, role: "USER" }
  },
  
  login: async (data) => {
    // Validate: email, password
    // Return: { token, email, name, role }
  }
};
```

### Posts

```typescript
const mockPostsAPI = {
  getCategories: async () => {
    // Return: [{ id: 1, name: "NEWS" }, ...]
  },
  
  getPosts: async (page = 0, size = 10) => {
    // Paginate: (page * size) through (page * size + size)
    // Return Spring Page format:
    // {
    //   content: [...],
    //   totalElements: 45,
    //   totalPages: 5,
    //   pageable: { pageNumber: 0, pageSize: 10 },
    //   last: false,
    //   first: true,
    //   empty: false
    // }
  },
  
  getPostById: async (id) => {
    // Return: PostResponse
  },
  
  createPost: async (data) => {
    // Generate new Long ID (max + 1)
    // Return 200 (not 201)
  },
  
  updatePost: async (id, data) => {
    // Return 200
  },
  
  deletePost: async (id) => {
    // Return 204 (empty response)
  }
};
```

### Comments

```typescript
const mockCommentsAPI = {
  getComments: async (postId) => {
    // Filter by postId
    // Sort by createdAt ASC (oldest first)
    // Return: CommentResponse[]
  },
  
  createComment: async (postId, data) => {
    // MOCKED (not in backend yet)
    // Generate new Long ID
    // Return: CommentResponse 200
  },
  
  deleteComment: async (id) => {
    // MOCKED (not in backend yet)
    // Return: 204 (empty response)
  }
};
```

---

## Pagination Handling in Frontend

```typescript
// OLD (1-indexed):
GET /api/posts?page=1&size=20

// NEW (0-indexed, matches backend):
GET /api/posts?page=0&size=10

// Backend response includes:
{
  content: [...], // actual posts
  totalElements: 45, // total posts
  totalPages: 5, // how many pages
  pageable: {
    pageNumber: 0,
    pageSize: 10
  }
}

// Frontend pagination:
const totalPages = Math.ceil(totalElements / pageSize);
if (page > 0) prevPage = page - 1;
if (page < totalPages - 1) nextPage = page + 1;
```

---

## Key Implementation Notes

1. **IDs:** Use numbers, not UUID strings
2. **Dates:** ISO format strings (e.g., "2024-01-15T10:30:00")
3. **Pagination:** 0-indexed pages (page 0 is first page)
4. **Categories:** Fetch from `GET /api/categories` endpoint
5. **Comment sorting:** ASC (oldest first) not DESC
6. **Mock comment endpoints:** Implement fully, swap with real when backend ready
7. **Delays:** Keep network delays (300-800ms) for realism

---

## What to Mock vs. Real

| Feature | Status | Action |
|---------|--------|--------|
| Auth | ✅ Real | Call backend directly |
| Categories | ✅ Real | Call backend directly |
| Posts CRUD | ✅ Real | Call backend directly |
| Get Comments | ✅ Real | Call backend directly |
| **Create Comment** | ⏳ Mocked | Build UI + mock, swap later |
| **Delete Comment** | ⏳ Mocked | Build UI + mock, swap later |
| **Search/Filter** | ⏳ Frontend only | UI only, no backend |
| **Analytics** | ⏳ Frontend only | UI only, no backend |

---

## Day-by-Day Implementation

**Day 1:** Auth ✅ (backend ready)
**Day 2:** Posts + Comments ✅ (list/create ready, delete mocked)
**Day 3:** Search UI ⏳ (mocked, no backend)
**Day 4:** Polish

---

This is simplified. The full mock code follows same pattern as before, just with updated endpoints/IDs/pagination.
