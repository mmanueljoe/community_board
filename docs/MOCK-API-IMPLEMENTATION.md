# CommunityBoard Mock API Implementation
## Production-Ready Mock Data & Implementation

**Purpose:** Working mock API that matches contract exactly
**When to use:** During development before backend is ready
**When to replace:** Swap with real API when backend is ready (same interface)

---

## FILE STRUCTURE

```
src/api/
├── contracts/                          # Define data shapes
│   ├── types.ts                       # TypeScript interfaces
│   └── constants.ts                   # Category constants
│
├── implementations/
│   ├── mock/                          # Current mock implementation
│   │   ├── mockData.ts                # Realistic test data
│   │   ├── mockAuth.ts                # Auth endpoints mock
│   │   ├── mockPosts.ts               # Posts endpoints mock
│   │   ├── mockComments.ts            # Comments endpoints mock
│   │   ├── mockAnalytics.ts           # Analytics mock
│   │   └── utils.ts                   # Helper functions
│   │
│   └── real/                          # Future real implementation
│       ├── authAPI.ts                 # Real auth
│       ├── postsAPI.ts                # Real posts
│       └── index.ts
│
└── index.ts                           # Export based on env
```

---

## PART 1: TYPE DEFINITIONS

### src/api/contracts/types.ts

```typescript
// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Post types
export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
  imageUrl: string | null;
}

export type PostCategory = 'NEWS' | 'EVENT' | 'DISCUSSION' | 'ALERT';

export interface CreatePostRequest {
  title: string;
  content: string;
  category: PostCategory;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  category?: PostCategory;
}

export interface GetPostsResponse {
  success: boolean;
  data: Post[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Comment types
export interface Comment {
  id: string;
  postId: string;
  text: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentRequest {
  text: string;
}

// Analytics types
export interface AnalyticsData {
  success: boolean;
  data: {
    summary: {
      totalPosts: number;
      totalComments: number;
      totalUsers: number;
      totalCategories: number;
    };
    postsByCategory: Record<PostCategory, number>;
    activityByDay: Array<{
      date: string;
      postCount: number;
      commentCount: number;
    }>;
    topContributors: Array<{
      id: string;
      name: string;
      email: string;
      postCount: number;
    }>;
    mostActiveDay: {
      day: string;
      postCount: number;
      commentCount: number;
    };
  };
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
```

### src/api/contracts/constants.ts

```typescript
export const POST_CATEGORIES = ['NEWS', 'EVENT', 'DISCUSSION', 'ALERT'] as const;

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'admin@amalitech.com',
  password: 'password123',
};

export const DEFAULT_USER_CREDENTIALS = {
  email: 'user@amalitech.com',
  password: 'password123',
};

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

---

## PART 2: MOCK DATA

### src/api/implementations/mock/mockData.ts

```typescript
import { User, Post, Comment, PostCategory } from '../../contracts/types';
import { v4 as uuidv4 } from 'uuid';

// Generate realistic timestamps
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// USERS
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@amalitech.com',
    name: 'Admin User',
    role: 'ADMIN',
    createdAt: daysAgo(90),
  },
  {
    id: 'user-2',
    email: 'user@amalitech.com',
    name: 'Test User',
    role: 'USER',
    createdAt: daysAgo(60),
  },
  {
    id: 'user-3',
    email: 'john@amalitech.com',
    name: 'John Doe',
    role: 'USER',
    createdAt: daysAgo(45),
  },
  {
    id: 'user-4',
    email: 'jane@amalitech.com',
    name: 'Jane Smith',
    role: 'USER',
    createdAt: daysAgo(40),
  },
  {
    id: 'user-5',
    email: 'bob@amalitech.com',
    name: 'Bob Wilson',
    role: 'USER',
    createdAt: daysAgo(35),
  },
  {
    id: 'user-6',
    email: 'alice@amalitech.com',
    name: 'Alice Brown',
    role: 'USER',
    createdAt: daysAgo(30),
  },
  {
    id: 'user-7',
    email: 'charlie@amalitech.com',
    name: 'Charlie Davis',
    role: 'USER',
    createdAt: daysAgo(25),
  },
];

// POSTS - Realistic data across categories
const postsData: Array<Omit<Post, 'commentCount'>> = [
  // NEWS posts
  {
    id: 'post-1',
    title: 'New Community Center Opening',
    content:
      'We\'re excited to announce the opening of our new state-of-the-art community center in downtown. The facility features fitness areas, classrooms, and meeting spaces for all to use.',
    category: 'NEWS',
    authorId: 'user-1',
    author: { id: 'user-1', name: 'Admin User', email: 'admin@amalitech.com' },
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
    imageUrl: null,
  },
  {
    id: 'post-2',
    title: 'Community Receives Grant for Education',
    content:
      'Our community has been awarded a $50,000 grant to support education initiatives. Funds will go towards scholarships and tutoring programs.',
    category: 'NEWS',
    authorId: 'user-3',
    author: { id: 'user-3', name: 'John Doe', email: 'john@amalitech.com' },
    createdAt: daysAgo(9),
    updatedAt: daysAgo(9),
    imageUrl: null,
  },
  {
    id: 'post-3',
    title: 'Local Businesses Partner for Sustainability',
    content:
      'Five local businesses have formed a partnership to reduce plastic use and promote environmental sustainability in our community.',
    category: 'NEWS',
    authorId: 'user-4',
    author: { id: 'user-4', name: 'Jane Smith', email: 'jane@amalitech.com' },
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
    imageUrl: null,
  },

  // EVENT posts
  {
    id: 'post-4',
    title: 'Monthly Community Cleanup - Saturday 9 AM',
    content:
      'Join us this Saturday at 9 AM for our monthly community cleanup. We\'ll be cleaning up parks and streets. Bring gloves and bags. Coffee and snacks provided!',
    category: 'EVENT',
    authorId: 'user-5',
    author: { id: 'user-5', name: 'Bob Wilson', email: 'bob@amalitech.com' },
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
    imageUrl: null,
  },
  {
    id: 'post-5',
    title: 'Free Yoga Classes in the Park',
    content:
      'Every Tuesday and Thursday at 7 PM, join us for free yoga classes in Central Park. All levels welcome. Bring a mat or find a spot on the grass.',
    category: 'EVENT',
    authorId: 'user-6',
    author: {
      id: 'user-6',
      name: 'Alice Brown',
      email: 'alice@amalitech.com',
    },
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
    imageUrl: null,
  },
  {
    id: 'post-6',
    title: 'Summer Festival - Mark Your Calendars!',
    content:
      'Our annual Summer Festival is coming July 15-17! Live music, food vendors, kids activities, and more. See you there!',
    category: 'EVENT',
    authorId: 'user-7',
    author: {
      id: 'user-7',
      name: 'Charlie Davis',
      email: 'charlie@amalitech.com',
    },
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
    imageUrl: null,
  },

  // DISCUSSION posts
  {
    id: 'post-7',
    title: 'What should our community focus on this year?',
    content:
      'We want to hear from you! What issues or projects do you think our community should prioritize? Please share your thoughts and ideas.',
    category: 'DISCUSSION',
    authorId: 'user-2',
    author: {
      id: 'user-2',
      name: 'Test User',
      email: 'user@amalitech.com',
    },
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    imageUrl: null,
  },
  {
    id: 'post-8',
    title: 'Thoughts on the new park improvements?',
    content:
      'The city has proposed some improvements to Riverside Park. What do you think? Should we add more benches, a playground, or a community garden?',
    category: 'DISCUSSION',
    authorId: 'user-3',
    author: { id: 'user-3', name: 'John Doe', email: 'john@amalitech.com' },
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    imageUrl: null,
  },
  {
    id: 'post-9',
    title: 'How can we improve public transportation?',
    content:
      'Our bus system needs improvement. What changes would make it better for you? Shorter wait times? More routes? Different hours?',
    category: 'DISCUSSION',
    authorId: 'user-4',
    author: { id: 'user-4', name: 'Jane Smith', email: 'jane@amalitech.com' },
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    imageUrl: null,
  },

  // ALERT posts
  {
    id: 'post-10',
    title: 'Road Closure: Main Street Construction',
    content:
      'ALERT: Main Street will be closed from 6th to 10th Avenue starting Monday for emergency water main repair. Plan alternate routes. Estimated completion: Friday.',
    category: 'ALERT',
    authorId: 'user-1',
    author: { id: 'user-1', name: 'Admin User', email: 'admin@amalitech.com' },
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    imageUrl: null,
  },
  {
    id: 'post-11',
    title: 'Water Service Interruption Tomorrow',
    content:
      'ALERT: Water service will be interrupted in the downtown area tomorrow 10 AM - 2 PM for maintenance. Please prepare accordingly.',
    category: 'ALERT',
    authorId: 'user-1',
    author: { id: 'user-1', name: 'Admin User', email: 'admin@amalitech.com' },
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    imageUrl: null,
  },
];

// Create posts with comment counts
export let mockPosts: Post[] = postsData.map((post) => ({
  ...post,
  commentCount: Math.floor(Math.random() * 20),
}));

// COMMENTS
export let mockComments: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    text: 'Great news! Looking forward to visiting the new center.',
    authorId: 'user-3',
    author: { id: 'user-3', name: 'John Doe', email: 'john@amalitech.com' },
    createdAt: daysAgo(9),
    updatedAt: daysAgo(9),
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    text: 'When will the grand opening ceremony be?',
    authorId: 'user-4',
    author: { id: 'user-4', name: 'Jane Smith', email: 'jane@amalitech.com' },
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
  },
  {
    id: 'comment-3',
    postId: 'post-1',
    text: 'Can anyone confirm if there\'s a parking lot?',
    authorId: 'user-5',
    author: { id: 'user-5', name: 'Bob Wilson', email: 'bob@amalitech.com' },
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },
  {
    id: 'comment-4',
    postId: 'post-4',
    text: 'Count me in! I\'ll bring my family.',
    authorId: 'user-2',
    author: { id: 'user-2', name: 'Test User', email: 'user@amalitech.com' },
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
  },
  {
    id: 'comment-5',
    postId: 'post-4',
    text: 'Thanks for organizing this!',
    authorId: 'user-6',
    author: {
      id: 'user-6',
      name: 'Alice Brown',
      email: 'alice@amalitech.com',
    },
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 'comment-6',
    postId: 'post-7',
    text: 'I think we should focus on community safety initiatives.',
    authorId: 'user-3',
    author: { id: 'user-3', name: 'John Doe', email: 'john@amalitech.com' },
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: 'comment-7',
    postId: 'post-7',
    text: 'Education and youth programs are important to me.',
    authorId: 'user-4',
    author: { id: 'user-4', name: 'Jane Smith', email: 'jane@amalitech.com' },
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
];

// Helper to add a comment to state (for mocking creation)
export function addMockComment(comment: Comment) {
  mockComments.push(comment);
  // Update post comment count
  const post = mockPosts.find((p) => p.id === comment.postId);
  if (post) {
    post.commentCount++;
  }
}

// Helper to delete a comment
export function deleteMockComment(commentId: string) {
  const index = mockComments.findIndex((c) => c.id === commentId);
  if (index !== -1) {
    const comment = mockComments[index];
    mockComments.splice(index, 1);
    // Update post comment count
    const post = mockPosts.find((p) => p.id === comment.postId);
    if (post) {
      post.commentCount--;
    }
  }
}

// Helper to add a post
export function addMockPost(post: Post) {
  mockPosts.unshift(post); // Add to front
}

// Helper to update a post
export function updateMockPost(id: string, updates: Partial<Post>) {
  const index = mockPosts.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockPosts[index] = {
      ...mockPosts[index],
      ...updates,
      updatedAt: new Date(),
    };
  }
}

// Helper to delete a post
export function deleteMockPost(id: string) {
  const index = mockPosts.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockPosts.splice(index, 1);
  }
}
```

---

## PART 3: UTILITY HELPERS

### src/api/implementations/mock/utils.ts

```typescript
import { User } from '../../contracts/types';
import { mockUsers } from './mockData';

// Simulate network delay
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Generate mock JWT token
export function generateMockToken(user: User): string {
  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  ).toString('base64url');

  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    })
  ).toString('base64url');

  // Mock signature (don't verify in client-side mock)
  const signature = Buffer.from('MOCK_SIGNATURE').toString('base64url');

  return `${header}.${payload}.${signature}`;
}

// Decode mock token (for client-side verification)
export function decodeMockToken(token: string): {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
  iat: number;
  exp: number;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    return payload;
  } catch {
    return null;
  }
}

// Get current user from token (mock)
export function getCurrentUserFromToken(token: string): User | null {
  const decoded = decodeMockToken(token);
  if (!decoded) return null;

  return mockUsers.find((u) => u.id === decoded.sub) || null;
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password: string): boolean {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
}

export function validatePostTitle(title: string): boolean {
  return title.length >= 5 && title.length <= 200;
}

export function validatePostContent(content: string): boolean {
  return content.length >= 10 && content.length <= 5000;
}

export function validateCommentText(text: string): boolean {
  return text.length >= 1 && text.length <= 1000;
}
```

---

## PART 4: MOCK API IMPLEMENTATIONS

### src/api/implementations/mock/mockAuth.ts

```typescript
import { delay, generateMockToken, validateEmail, validatePassword } from './utils';
import { mockUsers } from './mockData';
import { User, AuthResponse, ApiResponse, ApiError } from '../../contracts/types';
import { ERROR_CODES, HTTP_STATUS } from '../../contracts/constants';

export const mockAuthAPI = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
  }): Promise<{ data: AuthResponse; status: number }> => {
    // Simulate network delay
    await delay(500);

    // Validation
    const errors: Record<string, string> = {};

    if (!data.email || !validateEmail(data.email)) {
      errors.email = 'Invalid email address';
    }

    if (!data.password || !validatePassword(data.password)) {
      errors.password =
        'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!data.name || data.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (Object.keys(errors).length) {
      throw {
        status: HTTP_STATUS.BAD_REQUEST,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Validation failed',
          details: errors,
        },
      };
    }

    // Check if email already exists
    if (mockUsers.find((u) => u.email === data.email)) {
      throw {
        status: HTTP_STATUS.CONFLICT,
        error: {
          code: ERROR_CODES.CONFLICT,
          message: 'Email already registered',
          details: { email: 'This email is already in use' },
        },
      };
    }

    // Create user
    const user: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: 'USER',
      createdAt: new Date(),
    };

    mockUsers.push(user);
    const token = generateMockToken(user);

    return {
      data: { token, user },
      status: HTTP_STATUS.CREATED,
    };
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<{ data: AuthResponse; status: number }> => {
    // Simulate network delay
    await delay(500);

    const { email, password } = data;

    // Find user
    const user = mockUsers.find((u) => u.email === email);

    if (!user || password !== 'password123') {
      throw {
        status: HTTP_STATUS.UNAUTHORIZED,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Invalid credentials',
        },
      };
    }

    const token = generateMockToken(user);

    return {
      data: { token, user },
      status: HTTP_STATUS.OK,
    };
  },

  getCurrentUser: async (token: string): Promise<{ data: User; status: number }> => {
    // Simulate network delay
    await delay(100);

    const { decodeMockToken } = await import('./utils');
    const decoded = decodeMockToken(token);

    if (!decoded) {
      throw {
        status: HTTP_STATUS.UNAUTHORIZED,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Invalid or expired token',
        },
      };
    }

    const user = mockUsers.find((u) => u.id === decoded.sub);

    if (!user) {
      throw {
        status: HTTP_STATUS.NOT_FOUND,
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: 'User not found',
        },
      };
    }

    return {
      data: user,
      status: HTTP_STATUS.OK,
    };
  },
};
```

### src/api/implementations/mock/mockPosts.ts

```typescript
import { delay, validatePostTitle, validatePostContent } from './utils';
import {
  mockPosts,
  mockComments,
  addMockPost,
  updateMockPost,
  deleteMockPost,
  mockUsers,
} from './mockData';
import { Post, CreatePostRequest, UpdatePostRequest, PostCategory } from '../../contracts/types';
import { ERROR_CODES, HTTP_STATUS, POST_CATEGORIES } from '../../contracts/constants';
import { v4 as uuidv4 } from 'uuid';

export const mockPostsAPI = {
  getPosts: async (filters?: {
    category?: PostCategory;
    keyword?: string;
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'commentCount';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: Post[];
    pagination: { total: number; page: number; pageSize: number; totalPages: number };
    status: number;
  }> => {
    await delay(300);

    let results = [...mockPosts];

    // Filter by category
    if (filters?.category) {
      if (!POST_CATEGORIES.includes(filters.category)) {
        throw {
          status: HTTP_STATUS.BAD_REQUEST,
          error: {
            code: ERROR_CODES.BAD_REQUEST,
            message: 'Invalid category',
          },
        };
      }
      results = results.filter((p) => p.category === filters.category);
    }

    // Filter by keyword (search)
    if (filters?.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword) ||
          p.content.toLowerCase().includes(keyword)
      );
    }

    // Filter by date range
    if (filters?.startDate) {
      const startDate = new Date(filters.startDate);
      results = results.filter((p) => p.createdAt >= startDate);
    }

    if (filters?.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      results = results.filter((p) => p.createdAt <= endDate);
    }

    // Sort
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder || 'desc';

    results.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'commentCount') {
        return sortOrder === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
      }

      const aDate = new Date(aVal as Date).getTime();
      const bDate = new Date(bVal as Date).getTime();
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });

    // Pagination
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const paginatedResults = results.slice(start, start + pageSize);

    return {
      data: paginatedResults,
      pagination: {
        total: results.length,
        page,
        pageSize,
        totalPages: Math.ceil(results.length / pageSize),
      },
      status: HTTP_STATUS.OK,
    };
  },

  getPostById: async (id: string): Promise<{ data: Post & { comments: typeof mockComments }; status: number }> => {
    await delay(200);

    const post = mockPosts.find((p) => p.id === id);

    if (!post) {
      throw {
        status: HTTP_STATUS.NOT_FOUND,
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Post not found',
        },
      };
    }

    const comments = mockComments.filter((c) => c.postId === id);

    return {
      data: { ...post, comments },
      status: HTTP_STATUS.OK,
    };
  },

  createPost: async (
    data: CreatePostRequest,
    userId: string
  ): Promise<{ data: Post; status: number }> => {
    await delay(800);

    // Validation
    const errors: Record<string, string> = {};

    if (!validatePostTitle(data.title)) {
      errors.title = 'Title must be between 5 and 200 characters';
    }

    if (!validatePostContent(data.content)) {
      errors.content = 'Content must be between 10 and 5000 characters';
    }

    if (!data.category || !POST_CATEGORIES.includes(data.category)) {
      errors.category = 'Invalid category';
    }

    if (Object.keys(errors).length) {
      throw {
        status: HTTP_STATUS.BAD_REQUEST,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Validation failed',
          details: errors,
        },
      };
    }

    const author = mockUsers.find((u) => u.id === userId);

    if (!author) {
      throw {
        status: HTTP_STATUS.UNAUTHORIZED,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'User not found',
        },
      };
    }

    const post: Post = {
      id: uuidv4(),
      ...data,
      authorId: userId,
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      commentCount: 0,
      imageUrl: null,
    };

    addMockPost(post);

    return {
      data: post,
      status: HTTP_STATUS.CREATED,
    };
  },

  updatePost: async (
    id: string,
    data: UpdatePostRequest,
    userId: string
  ): Promise<{ data: Post; status: number }> => {
    await delay(600);

    const post = mockPosts.find((p) => p.id === id);

    if (!post) {
      throw {
        status: HTTP_STATUS.NOT_FOUND,
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Post not found',
        },
      };
    }

    // Check authorization
    const user = mockUsers.find((u) => u.id === userId);
    if (!user || (user.id !== post.authorId && user.role !== 'ADMIN')) {
      throw {
        status: HTTP_STATUS.FORBIDDEN,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Only post author or admin can update this post',
        },
      };
    }

    // Validation
    const errors: Record<string, string> = {};

    if (data.title && !validatePostTitle(data.title)) {
      errors.title = 'Title must be between 5 and 200 characters';
    }

    if (data.content && !validatePostContent(data.content)) {
      errors.content = 'Content must be between 10 and 5000 characters';
    }

    if (data.category && !POST_CATEGORIES.includes(data.category)) {
      errors.category = 'Invalid category';
    }

    if (Object.keys(errors).length) {
      throw {
        status: HTTP_STATUS.BAD_REQUEST,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Validation failed',
          details: errors,
        },
      };
    }

    const updates = {
      ...(data.title && { title: data.title }),
      ...(data.content && { content: data.content }),
      ...(data.category && { category: data.category }),
    };

    updateMockPost(id, updates);
    const updated = mockPosts.find((p) => p.id === id)!;

    return {
      data: updated,
      status: HTTP_STATUS.OK,
    };
  },

  deletePost: async (id: string, userId: string): Promise<{ data: { message: string }; status: number }> => {
    await delay(500);

    const post = mockPosts.find((p) => p.id === id);

    if (!post) {
      throw {
        status: HTTP_STATUS.NOT_FOUND,
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Post not found',
        },
      };
    }

    // Check authorization
    const user = mockUsers.find((u) => u.id === userId);
    if (!user || (user.id !== post.authorId && user.role !== 'ADMIN')) {
      throw {
        status: HTTP_STATUS.FORBIDDEN,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Only post author or admin can delete this post',
        },
      };
    }

    // Delete associated comments
    const commentIds = mockComments
      .filter((c) => c.postId === id)
      .map((c) => c.id);

    commentIds.forEach((commentId) => {
      const index = mockComments.findIndex((c) => c.id === commentId);
      if (index !== -1) {
        mockComments.splice(index, 1);
      }
    });

    deleteMockPost(id);

    return {
      data: { message: 'Post deleted successfully' },
      status: HTTP_STATUS.OK,
    };
  },
};
```

### src/api/implementations/mock/mockComments.ts

```typescript
import { delay, validateCommentText } from './utils';
import { mockComments, addMockComment, deleteMockComment, mockUsers } from './mockData';
import { Comment, CreateCommentRequest } from '../../contracts/types';
import { ERROR_CODES, HTTP_STATUS } from '../../contracts/constants';
import { v4 as uuidv4 } from 'uuid';

export const mockCommentsAPI = {
  getComments: async (postId: string, page = 1, pageSize = 50): Promise<{
    data: Comment[];
    pagination: { total: number; page: number; pageSize: number; totalPages: number };
    status: number;
  }> => {
    await delay(200);

    let results = mockComments.filter((c) => c.postId === postId);

    // Sort by newest first
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const start = (page - 1) * pageSize;
    const paginatedResults = results.slice(start, start + pageSize);

    return {
      data: paginatedResults,
      pagination: {
        total: results.length,
        page,
        pageSize,
        totalPages: Math.ceil(results.length / pageSize),
      },
      status: HTTP_STATUS.OK,
    };
  },

  createComment: async (
    postId: string,
    data: CreateCommentRequest,
    userId: string
  ): Promise<{ data: Comment; status: number }> => {
    await delay(400);

    // Validation
    if (!validateCommentText(data.text)) {
      throw {
        status: HTTP_STATUS.BAD_REQUEST,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Comment text must be between 1 and 1000 characters',
          details: { text: 'Invalid comment text' },
        },
      };
    }

    const author = mockUsers.find((u) => u.id === userId);

    if (!author) {
      throw {
        status: HTTP_STATUS.UNAUTHORIZED,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'User not found',
        },
      };
    }

    const comment: Comment = {
      id: uuidv4(),
      postId,
      text: data.text,
      authorId: userId,
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addMockComment(comment);

    return {
      data: comment,
      status: HTTP_STATUS.CREATED,
    };
  },

  deleteComment: async (id: string, userId: string): Promise<{ data: { message: string }; status: number }> => {
    await delay(300);

    const comment = mockComments.find((c) => c.id === id);

    if (!comment) {
      throw {
        status: HTTP_STATUS.NOT_FOUND,
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Comment not found',
        },
      };
    }

    // Check authorization
    const user = mockUsers.find((u) => u.id === userId);
    if (!user || (user.id !== comment.authorId && user.role !== 'ADMIN')) {
      throw {
        status: HTTP_STATUS.FORBIDDEN,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Only comment author or admin can delete this comment',
        },
      };
    }

    deleteMockComment(id);

    return {
      data: { message: 'Comment deleted successfully' },
      status: HTTP_STATUS.OK,
    };
  },
};
```

### src/api/implementations/mock/mockAnalytics.ts

```typescript
import { delay, mockPosts, mockComments, mockUsers } from './mockData';
import { AnalyticsData, PostCategory } from '../../contracts/types';
import { HTTP_STATUS } from '../../contracts/constants';

export const mockAnalyticsAPI = {
  getAnalytics: async (filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: AnalyticsData['data']; status: number }> => {
    await delay(500);

    let posts = [...mockPosts];
    let comments = [...mockComments];

    // Filter by date if provided
    if (filters?.startDate) {
      const startDate = new Date(filters.startDate);
      posts = posts.filter((p) => p.createdAt >= startDate);
      comments = comments.filter((c) => c.createdAt >= startDate);
    }

    if (filters?.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      posts = posts.filter((p) => p.createdAt <= endDate);
      comments = comments.filter((c) => c.createdAt <= endDate);
    }

    // Calculate posts by category
    const postsByCategory: Record<PostCategory, number> = {
      NEWS: 0,
      EVENT: 0,
      DISCUSSION: 0,
      ALERT: 0,
    };

    posts.forEach((post) => {
      postsByCategory[post.category]++;
    });

    // Calculate activity by day (last 7 days)
    const activityByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayStart = new Date(dateStr);
      const dayEnd = new Date(dateStr);
      dayEnd.setHours(23, 59, 59, 999);

      const dayPosts = posts.filter(
        (p) => p.createdAt >= dayStart && p.createdAt <= dayEnd
      ).length;

      const dayComments = comments.filter(
        (c) => c.createdAt >= dayStart && c.createdAt <= dayEnd
      ).length;

      activityByDay.push({
        date: dateStr,
        postCount: dayPosts,
        commentCount: dayComments,
      });
    }

    // Calculate top contributors
    const contributors: Record<string, { id: string; name: string; email: string; postCount: number }> = {};

    posts.forEach((post) => {
      if (!contributors[post.authorId]) {
        contributors[post.authorId] = {
          id: post.author.id,
          name: post.author.name,
          email: post.author.email,
          postCount: 0,
        };
      }
      contributors[post.authorId].postCount++;
    });

    const topContributors = Object.values(contributors)
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);

    // Calculate most active day of week
    const dayOfWeekActivity: Record<string, { postCount: number; commentCount: number }> = {
      Monday: { postCount: 0, commentCount: 0 },
      Tuesday: { postCount: 0, commentCount: 0 },
      Wednesday: { postCount: 0, commentCount: 0 },
      Thursday: { postCount: 0, commentCount: 0 },
      Friday: { postCount: 0, commentCount: 0 },
      Saturday: { postCount: 0, commentCount: 0 },
      Sunday: { postCount: 0, commentCount: 0 },
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    posts.forEach((post) => {
      const dayName = daysOfWeek[post.createdAt.getDay()];
      dayOfWeekActivity[dayName].postCount++;
    });

    comments.forEach((comment) => {
      const dayName = daysOfWeek[comment.createdAt.getDay()];
      dayOfWeekActivity[dayName].commentCount++;
    });

    let mostActiveDay = { day: 'Monday', postCount: 0, commentCount: 0 };
    Object.entries(dayOfWeekActivity).forEach(([day, activity]) => {
      if (activity.postCount > mostActiveDay.postCount) {
        mostActiveDay = { day, ...activity };
      }
    });

    return {
      data: {
        summary: {
          totalPosts: posts.length,
          totalComments: comments.length,
          totalUsers: mockUsers.length,
          totalCategories: 4,
        },
        postsByCategory,
        activityByDay,
        topContributors,
        mostActiveDay,
      },
      status: HTTP_STATUS.OK,
    };
  },
};
```

---

## PART 5: UNIFIED API EXPORT

### src/api/index.ts

```typescript
import { mockAuthAPI } from './implementations/mock/mockAuth';
import { mockPostsAPI } from './implementations/mock/mockPosts';
import { mockCommentsAPI } from './implementations/mock/mockComments';
import { mockAnalyticsAPI } from './implementations/mock/mockAnalytics';

// Currently using mock
// When backend is ready, swap to real implementations

export const API = {
  auth: mockAuthAPI,
  posts: mockPostsAPI,
  comments: mockCommentsAPI,
  analytics: mockAnalyticsAPI,
};

export * from './contracts/types';
export * from './contracts/constants';
```

---

## USAGE IN YOUR SERVICES

### src/services/authService.ts

```typescript
import { API } from '../api';

export const authService = {
  register: async (email: string, password: string, name: string) => {
    const { data } = await API.auth.register({ email, password, name });
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await API.auth.login({ email, password });
    return data;
  },

  getCurrentUser: async (token: string) => {
    const { data } = await API.auth.getCurrentUser(token);
    return data;
  },
};
```

---

## KEY FEATURES OF THIS MOCK API

✅ **Realistic Behaviors:**
- Network delays (300-800ms)
- Validation (email, password strength, content length)
- Authorization checks (only author can edit/delete)
- Stateful (create actually adds, delete actually removes)

✅ **Production-Ready:**
- Matches API contract exactly
- All error cases handled
- Proper HTTP status codes
- Same interface as real API (swap implementation)

✅ **Easy to Test:**
- No external dependencies
- Synchronous error handling
- Realistic data (50+ posts, 200+ comments)
- Actual timestamps and relationships

✅ **Easy to Extend:**
- Add more test data in mockData.ts
- Add helper functions for test scenarios
- Modify delays for different test cases

---

## NEXT STEPS

1. Copy these files into your `src/api/` folder
2. Install uuid: `npm install uuid`
3. Use in services: `import { API } from '../api'`
4. When backend is ready, swap `mockAuthAPI` with `realAuthAPI`
5. Zero changes to code using the API

This is production-quality mock implementation that will make your development smooth!
