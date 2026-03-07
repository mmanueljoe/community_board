# CommunityBoard Frontend — Comprehensive Architectural Brainstorm
## Senior-Level Design Review (Building Ahead of Backend)

**Constraints:**
- Backend NOT available yet
- 4 days to production-ready code
- Production quality from day 1 (not "spike then refactor")
- Building independently (team coordinates later)
- Figma design as single source of truth
- Building to learn, build to own, build correctly

**Philosophy:**
- Make intentional decisions, understand trade-offs
- Production patterns from day 1 (no technical debt)
- Incremental decisions (what must be decided first)
- Mock data strategy that integrates seamlessly with real backend later
- Leverage your MCPs (Figma, sequential-thinking, rsuite, context7)

---

## PART 1: CONSTRAINTS & REQUIREMENTS ANALYSIS

### Project Requirements
```
MVP Features:
├─ Auth: JWT login/register with role management (ADMIN/USER)
├─ Posts: CRUD with 4 categories (NEWS, EVENT, DISCUSSION, ALERT)
├─ Comments: CRUD on posts
├─ Search/Filter: by category, date, keyword
└─ Dashboard: analytics (posts/category, top contributors, activity)

Tech Stack:
├─ React 18 (functional, hooks)
├─ REST APIs (backend not ready)
├─ PostgreSQL (backend manages)
└─ Responsive design (mobile-first)

Team Coordination:
├─ Backend: Bruce (Java/Spring)
├─ QA: Divine
├─ Data: Ernest (analytics prep)
└─ DevOps: Joel (Docker/CI-CD)
```

### Building Ahead Constraint
```
What's NOT available:
✗ Backend APIs (won't be ready until next week)
✗ Real database
✗ Real authentication
✗ API documentation (exact shape of requests/responses)

What you CAN do:
✓ Design the frontend architecture
✓ Build with mock data
✓ Validate design against Figma
✓ Write tests with mocked APIs
✓ Have code ready to integrate immediately
```

### Production-Ready Constraint
```
"Production-ready from day 1" means:
✓ No shortcuts that create tech debt
✓ Patterns that scale beyond this MVP
✓ Code you'd be proud to ship
✓ Easy backend integration when ready
✓ Testable, maintainable, documented

NOT about:
✗ Over-engineering for future features you won't build
✗ Premature optimization
✗ Using every pattern/library possible
```

---

## PART 2: DECISION DEPENDENCY MAP

### Which Decisions Depend on Which?

```
TIER 0 (Foundation - Decide First)
├─ API Contract Definition
│  └─ Mock implementation strategy
│  └─ Request/response shapes
│  └─ Error handling contract
│
└─ Component Architecture Decision
   └─ Atomic vs Feature-based?
   └─ Folder structure
   └─ Naming conventions

        ↓ (Everything else builds on these)

TIER 1 (State Management)
├─ Auth state management
│  └─ Depends on: API contract, component architecture
│
├─ Post/data state management  
│  └─ Depends on: API contract, component architecture
│
└─ Global state strategy
   └─ Depends on: Both auth and data state decisions

        ↓

TIER 2 (Features)
├─ Form handling & validation
│  └─ Depends on: API contract, state management
│
├─ API integration layer
│  └─ Depends on: API contract, state management
│
└─ Component building (UI)
   └─ Depends on: Component architecture, state management

        ↓

TIER 3 (Integration & Polish)
├─ Error handling
│  └─ Depends on: API layer, state management
│
├─ Loading states
│  └─ Depends on: API layer, component design
│
└─ Testing strategy
   └─ Depends on: All above
```

### The Three "Must Decide First" Decisions

Before you code a single component, you need clarity on:

1. **API Contract Definition** (What does the backend give you?)
2. **Component Architecture** (How do you organize code?)
3. **State Management Approach** (How do you manage state?)

**Everything else flows from these three.**

---

## PART 3: ARCHITECTURAL DECISIONS (In Order of Dependency)

---

## DECISION 1: API Contract Definition

### The Challenge
Backend isn't built yet. You need to:
- ✅ Know what API endpoints exist
- ✅ Know request/response shapes
- ✅ Know error formats
- ✅ Know authentication method
- ✅ Not be blocked by implementation

### Your Options

**Option A: Infer from Project Docs + Coordinate**
```
1. Read project requirements (you did this)
2. List out endpoints you'll need:
   POST /auth/register
   POST /auth/login
   GET /api/posts?category=&keyword=
   POST /api/posts
   ... etc

3. Define request/response shape (what makes sense):
   POST /auth/login
   Request:  { email, password }
   Response: { token, user: { id, email, name, role } }

4. Coordinate with backend (Bruce):
   "I'm assuming these shapes. OK?"
   "Here's what I'm assuming for error responses"

5. Build with these shapes
6. When backend is ready, verify shapes match
```

**Option B: Use Backend Starter Code + API Docs**
```
Check the starter code repository for:
- README with API docs (sometimes included)
- API endpoint examples
- Spring Boot controller definitions
- Request/response examples in code comments
```

**Option C: Build API-Agnostic Layer (Most Professional)**
```
Design your API layer so it can work with ANY shape:

// Define contract once
const PostAPI = {
  getPosts: async (filters) => { /* abstract */ },
  createPost: async (data) => { /* abstract */ },
  // etc
}

// Implement with mock data
const MockPostAPI = {
  getPosts: async (filters) => ({
    data: [{ id: 1, title: "Test" }],
    total: 1
  }),
  // etc
}

// Later, swap implementation
const RealPostAPI = {
  getPosts: async (filters) => 
    axios.get('/api/posts', { params: filters })
  // etc
}

// Usage never changes
const posts = await PostAPI.getPosts({ category: 'NEWS' })
```

### RECOMMENDATION: Option C (API-Agnostic with Mocks)

**Why?**
- ✅ You're not blocked by backend
- ✅ Code is production-ready (real implementation when backend is ready)
- ✅ Tests work with or without real backend
- ✅ Zero rework when backend is ready
- ✅ Senior-level pattern

**How to Execute:**
1. Review project requirements + starter code
2. Infer reasonable API shapes (POST /auth/login, GET /api/posts, etc)
3. Contact Bruce: "I'm building with these shapes, please confirm"
4. Create abstract API interfaces
5. Implement with mock data
6. Tests use mocks
7. When backend ready, swap implementation

**Example Structure:**
```
src/
├── api/
│   ├── contracts/           ← Define what endpoints look like
│   │   ├── auth.ts         ← Auth endpoint shapes
│   │   ├── posts.ts        ← Post endpoint shapes
│   │   └── comments.ts     ← Comment endpoint shapes
│   │
│   ├── implementations/
│   │   ├── mock/           ← Current: mock implementation
│   │   │   ├── authAPI.ts
│   │   │   ├── postsAPI.ts
│   │   │   └── mockData.ts
│   │   │
│   │   └── real/           ← Future: real backend
│   │       ├── authAPI.ts
│   │       ├── postsAPI.ts
│   │       └── axios-instance.ts
│   │
│   └── index.ts            ← Export based on env
│       └── export const API = process.env.USE_MOCK ? MockAPI : RealAPI
```

**MCP Usage for This Decision:**
- Use `rsuite` MCP to understand component API contracts (how data flows through UI)
- Use `everything` MCP to research REST API best practices
- Use `sequential-thinking` to map out all endpoints needed

---

## DECISION 2: Component Architecture

### The Challenge
How do you organize 20-30 components in a way that's:
- Easy to navigate
- Easy to modify
- Easy for team to coordinate
- Scalable beyond MVP

### Your Options

**Option A: Atomic Design (Atoms → Molecules → Organisms)**
```
components/
├── atoms/              ← Smallest reusable units
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Badge.jsx
│   └── Spinner.jsx
│
├── molecules/          ← Combinations of atoms
│   ├── SearchBar.jsx
│   ├── PostCard.jsx
│   └── CommentCard.jsx
│
├── organisms/          ← Complex components
│   ├── PostList.jsx
│   ├── CommentSection.jsx
│   └── Dashboard.jsx
│
└── templates/          ← Page layouts
    ├── AuthLayout.jsx
    └── MainLayout.jsx
```

**Pros:**
- ✅ Clear hierarchy
- ✅ Reusable atoms
- ✅ Easy to maintain
- ✅ Good for design systems

**Cons:**
- ❌ Can be abstract (hard to find things by feature)
- ❌ Atoms library gets large
- ❌ Not great for feature-specific logic

---

**Option B: Feature-Based (Organize by Feature/Domain)**
```
components/
├── Auth/               ← Auth feature
│   ├── Login.jsx
│   ├── Register.jsx
│   └── ProtectedRoute.jsx
│
├── Posts/              ← Posts feature
│   ├── PostList.jsx
│   ├── PostDetail.jsx
│   ├── CreatePost.jsx
│   └── EditPost.jsx
│
├── Comments/           ← Comments feature
│   ├── CommentList.jsx
│   ├── CommentForm.jsx
│   └── CommentCard.jsx
│
├── Dashboard/          ← Dashboard feature
│   ├── Analytics.jsx
│   ├── Charts.jsx
│   └── Stats.jsx
│
└── Common/             ← Shared across features
    ├── Button.jsx
    ├── Card.jsx
    └── Modal.jsx
```

**Pros:**
- ✅ Easy to find things by feature
- ✅ Feature-specific logic stays together
- ✅ Easy to work in parallel (your team!)
- ✅ Easy to add/remove features

**Cons:**
- ❌ Can duplicate UI patterns
- ❌ Reusability requires discipline

---

**Option C: Hybrid (Feature + Atomic for Common)**
```
components/
├── common/             ← Shared UI atoms/molecules
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── Input.jsx
│   └── Modal.jsx
│
├── features/           ← Feature-based components
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── Posts/
│   │   ├── PostList.jsx
│   │   ├── PostDetail.jsx
│   │   └── CreatePost.jsx
│   │
│   └── Dashboard/
│       ├── Analytics.jsx
│       └── Charts.jsx
│
└── layouts/            ← Page structure
    ├── MainLayout.jsx
    └── AuthLayout.jsx
```

**Pros:**
- ✅ Best of both worlds
- ✅ Reusable atoms in `common`
- ✅ Feature logic stays organized
- ✅ Clear separation of concerns

**Cons:**
- ❌ Slightly more structure to maintain
- ❌ Need discipline on what goes in `common` vs `features`

---

### RECOMMENDATION: **Option C - Hybrid (Feature + Common)**

**Why?**
- ✅ Scales as project grows
- ✅ Easy for team coordination (each person owns a feature)
- ✅ Clear boundaries (common vs feature-specific)
- ✅ Production-grade organization
- ✅ Aligns with your team structure (5 people, potentially parallel work later)

**Structure:**
```
src/
├── components/
│   ├── common/                 ← Shared UI components
│   │   ├── Button.jsx         (variants: primary, secondary, danger, disabled)
│   │   ├── Card.jsx           (wrapper component)
│   │   ├── Badge.jsx          (for category labels)
│   │   ├── Input.jsx          (form input wrapper)
│   │   ├── TextArea.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   ├── Spinner.jsx
│   │   ├── Skeleton.jsx       (loading state)
│   │   └── ErrorMessage.jsx
│   │
│   ├── features/               ← Feature-specific components
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── Posts/
│   │   │   ├── PostList.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── EditPost.jsx
│   │   │   ├── PostCard.jsx   (post preview card)
│   │   │   └── CategoryFilter.jsx
│   │   │
│   │   ├── Comments/
│   │   │   ├── CommentList.jsx
│   │   │   ├── CommentForm.jsx
│   │   │   └── CommentCard.jsx
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── Analytics.jsx
│   │   │   ├── PostChart.jsx
│   │   │   ├── ActivityChart.jsx
│   │   │   └── ContributorStats.jsx
│   │   │
│   │   └── Search/
│   │       ├── SearchBar.jsx
│   │       ├── FilterPanel.jsx
│   │       └── DateRangePicker.jsx
│   │
│   └── layout/                 ← Page structure
│       ├── MainLayout.jsx
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       └── Footer.jsx
│
├── pages/                      ← Page-level routing
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── PostsPage.jsx
│   ├── PostDetailPage.jsx
│   ├── DashboardPage.jsx
│   └── NotFoundPage.jsx
│
├── hooks/                      ← Custom hooks
│   ├── useAuth.js
│   ├── usePosts.js
│   ├── useComments.js
│   └── useFetch.js
│
├── context/                    ← State management
│   ├── AuthContext.jsx
│   ├── PostContext.jsx
│   └── UIContext.jsx
│
├── api/                        ← API layer (abstract + implementations)
│   ├── contracts/
│   ├── implementations/
│   └── index.js
│
├── utils/                      ← Helper functions
│   ├── formatDate.js
│   ├── constants.js
│   └── validation.js
│
├── styles/                     ← Global styles
│   ├── globals.css
│   └── tailwind.config.js
│
└── App.jsx                     ← Root component
```

**Key Principles:**
1. **Common components are GENERIC** (Button works anywhere)
2. **Feature components are SPECIFIC** (PostList is only used in posts feature)
3. **Hooks are BEHAVIOR** (useAuth, usePosts extract logic)
4. **Context is STATE** (AuthContext, PostContext manage data)
5. **Pages are ROUTING** (Maps URLs to features)

**How This Supports Your Team:**
```
You (Frontend):
  ├─ owns: components/features/Posts, components/features/Comments, components/features/Dashboard
  ├─ coordinating: API contracts with backend
  └─ integrating: all features together

Backend (Bruce):
  └─ implements: API endpoints that components consume

QA (Divine):
  ├─ tests: each feature component
  └─ writes: test cases for PostList, CommentForm, etc

Data (Ernest):
  └─ provides: analytics data shape

DevOps (Joel):
  └─ handles: build/deployment config
```

**MCP Usage for This Decision:**
- Use `rsuite` MCP to understand component composition patterns
- Use `sequential-thinking` to map out component hierarchy
- Use `Figma` MCP to extract component specs from design

---

## DECISION 3: State Management Approach

### The Challenge
You need to manage:
1. **Auth state** — user, token, isAuthenticated, isLoading
2. **Post data** — posts list, filters, pagination, loading
3. **UI state** — modal open/closed, toast messages, sidebar open/closed
4. **Temporary data** — form drafts, search input value

Each has different needs:
- Auth: persists across sessions, rarely changes, needed everywhere
- Posts: fetched from API, needs refetching, needs caching
- UI: temporary, component-specific, rarely shared
- Temp: very temporary, form-scoped

### Your Options

**Option A: Context API Only (Simple, Sufficient)**
```
// AuthContext
const AuthContext = createContext()
useAuth() hook → { user, login(), logout() }

// PostContext  
const PostContext = createContext()
usePosts() hook → { posts, filters, createPost(), updatePost() }

// UIContext
const UIContext = createContext()
useUI() hook → { isSidebarOpen, toggleSidebar(), showToast() }

// Usage
function PostList() {
  const { posts } = usePosts()
  const { user } = useAuth()
  return posts.map(post => ...)
}
```

**Pros:**
- ✅ Simple, no new library
- ✅ Easy to understand
- ✅ Sufficient for MVP
- ✅ Good for learning

**Cons:**
- ❌ Manual caching (when to refetch?)
- ❌ Manual deduplication (two places fetch same data)
- ❌ More boilerplate for complex state
- ❌ Doesn't scale to large apps

---

**Option B: React Query (Professional, Feature-Rich)**
```
// In postService.js
const useGetPosts = (filters) => {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postAPI.getPosts(filters),
    staleTime: 5 * 60 * 1000,  // 5 min
    cacheTime: 10 * 60 * 1000, // 10 min
  })
}

// Usage
function PostList() {
  const { data: posts, isLoading } = useGetPosts(filters)
  return posts.map(post => ...)
}
```

**Pros:**
- ✅ Automatic caching
- ✅ Automatic refetching on focus
- ✅ Deduplication out of box
- ✅ Built-in loading/error states
- ✅ Background refetch
- ✅ Scales to large apps
- ✅ Production standard

**Cons:**
- ❌ New library to learn
- ❌ Overkill for simple state (auth)
- ❌ Takes time to set up initially

---

**Option C: Zustand (Lightweight Middle Ground)**
```
// Simple store
const usePostStore = create((set) => ({
  posts: [],
  filters: {},
  setPosts: (posts) => set({ posts }),
  setFilters: (filters) => set({ filters }),
}))

// Usage
function PostList() {
  const { posts } = usePostStore()
  return posts.map(post => ...)
}
```

**Pros:**
- ✅ Simple API
- ✅ No boilerplate
- ✅ Good for complex state
- ✅ Lightweight

**Cons:**
- ❌ No caching/refetching (you manage it)
- ❌ Less standard than Context or React Query

---

### RECOMMENDATION: **Hybrid Approach**

**Use Context API for auth** (rarely changes, persists) + **React Query for data** (needs caching/refetching)

**Why?**
- ✅ Auth is simple, Context is perfect for it
- ✅ Post data is complex, React Query handles it perfectly
- ✅ Production-standard approach
- ✅ Scales beyond MVP
- ✅ Two different problems need different solutions

**Structure:**
```
// Auth state → Context API
useAuth() → { user, token, login(), logout() }

// Post data → React Query
useGetPosts() → useQuery(['posts', filters], ...)
useCreatePost() → useMutation(...)
useUpdatePost() → useMutation(...)

// UI state → useState or lightweight Context
useState for component-specific (modal open?)
useUI() for cross-component (sidebar, toast)
```

**Timeline:**
- **Days 1-2:** Use Context API for everything (simpler to learn)
- **Day 3:** Upgrade to React Query if backend is ready (plug-and-play replacement)
- **Fallback:** If upgrade feels risky, keep Context API (it works!)

**Why This Works:**
- You learn Context API first (good foundation)
- You can upgrade to React Query when ready
- Mock API layer makes swap seamless
- No tech debt either way

---

## DECISION 4: Mock Data Strategy

### The Challenge
Backend isn't ready. You need:
- ✅ Realistic mock data
- ✅ Easy to add/remove/change
- ✅ Feels like real backend
- ✅ Works with your API layer

### Your Approach

**Create a Mock API Implementation:**

```
src/api/implementations/mock/mockData.ts
├─ Generate realistic test data
├─ 50+ posts with various categories
├─ 200+ comments
├─ Multiple users

src/api/implementations/mock/authAPI.ts
├─ login({ email, password })
├─ register({ email, password, name })
├─ logout()
├─ getCurrentUser()

src/api/implementations/mock/postsAPI.ts
├─ getPosts(filters)
├─ getPostById(id)
├─ createPost(data)
├─ updatePost(id, data)
├─ deletePost(id)

src/api/implementations/mock/commentsAPI.ts
├─ getComments(postId)
├─ createComment(postId, text)
├─ deleteComment(id)

src/api/implementations/mock/analyticsAPI.ts
├─ getAnalytics()
```

**Realistic Mock Data:**

```javascript
// mockData.ts
export const mockUsers = [
  { id: 1, email: 'admin@amalitech.com', name: 'Admin User', role: 'ADMIN' },
  { id: 2, email: 'user@amalitech.com', name: 'Test User', role: 'USER' },
  { id: 3, email: 'john@amalitech.com', name: 'John Doe', role: 'USER' },
  // ... 20+ users
];

export const mockPosts = [
  {
    id: 1,
    title: 'New Community Center Opening',
    content: 'Excited to announce our new community center...',
    category: 'NEWS',
    authorId: 1,
    createdAt: new Date('2024-01-15'),
    commentCount: 5,
  },
  // ... 50+ posts across all categories
];

export const mockComments = [
  {
    id: 1,
    postId: 1,
    authorId: 2,
    text: 'Great news! Looking forward to visiting.',
    createdAt: new Date('2024-01-15'),
  },
  // ... 200+ comments
];
```

**Behaviors:**

```javascript
// authAPI mock implements LOGIN/REGISTER/LOGOUT
export const mockAuthAPI = {
  login: async ({ email, password }) => {
    // Simulate network delay
    await delay(500);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }
    
    const token = createMockToken(user);
    return { token, user };
  },
  
  register: async ({ email, password, name }) => {
    await delay(500);
    
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    
    const user = { 
      id: mockUsers.length + 1, 
      email, 
      name, 
      role: 'USER' 
    };
    mockUsers.push(user);
    
    const token = createMockToken(user);
    return { token, user };
  },
};

// postsAPI mock implements CRUD
export const mockPostsAPI = {
  getPosts: async (filters) => {
    await delay(300);
    
    let results = [...mockPosts];
    
    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }
    
    if (filters.keyword) {
      results = results.filter(p => 
        p.title.includes(filters.keyword) || 
        p.content.includes(filters.keyword)
      );
    }
    
    // Pagination
    const page = filters.page || 1;
    const pageSize = 20;
    const start = (page - 1) * pageSize;
    
    return {
      data: results.slice(start, start + pageSize),
      total: results.length,
      page,
      pageSize,
    };
  },
  
  createPost: async (data) => {
    await delay(800); // Simulate longer operation
    
    const post = {
      id: mockPosts.length + 1,
      ...data,
      authorId: getCurrentUserId(), // From auth context
      createdAt: new Date(),
      commentCount: 0,
    };
    
    mockPosts.unshift(post); // Add to front
    return post;
  },
};
```

**Key Features:**
- ✅ Realistic network delays (300-800ms)
- ✅ Real error handling (validation, etc)
- ✅ Real data shapes (match API contract)
- ✅ Stateful (create actually adds, delete actually removes)
- ✅ Easy to switch to real API (same interface)

---

## DECISION 5: Form Handling & Validation

### The Challenge
You need:
- Client-side validation (UX feedback)
- Server-side validation handling (from mock/real API)
- Controlled components (React way)
- Clean, maintainable code

### Your Options

**Option A: useState for Each Field (Simple)**
```javascript
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email required';
    if (!password) newErrors.password = 'Password required';
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      // success
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      {/* ... */}
    </form>
  );
}
```

**Pros:**
- ✅ Simple to understand
- ✅ No dependencies
- ✅ Good for small forms

**Cons:**
- ❌ Verbose for complex forms
- ❌ Lots of state to manage
- ❌ Lots of boilerplate

---

**Option B: React Hook Form (Professional Standard)**
```javascript
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { email: '', password: '' },
  });
  
  const onSubmit = async (data) => {
    try {
      const response = await authAPI.login(data);
      // success
    } catch (error) {
      // handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email', { required: 'Email required' })}
        error={errors.email?.message}
      />
      <Input
        {...register('password', { required: 'Password required' })}
        error={errors.password?.message}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

**Pros:**
- ✅ Much less boilerplate
- ✅ Built-in validation
- ✅ Performance optimized (only affected fields rerender)
- ✅ Production standard
- ✅ Scales to complex forms

**Cons:**
- ❌ New library
- ❌ Slightly different API than vanilla useState

---

### RECOMMENDATION: **React Hook Form (Production-Ready)**

**Why?**
- ✅ Industry standard
- ✅ Less code, less bugs
- ✅ Better performance
- ✅ Scales to complex forms

**Validation Strategy:**

```javascript
// Client-side: immediate feedback
<Input
  {...register('email', {
    required: 'Email required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email'
    }
  })}
/>

// Server-side: from API response
const onSubmit = async (data) => {
  try {
    const response = await authAPI.register(data);
  } catch (error) {
    if (error.status === 400) {
      // Server validation error
      setErrors({
        email: error.response.data.message // "Email already exists"
      });
    }
  }
};
```

---

## DECISION 6: Testing Without Backend

### The Challenge
You can't hit real APIs yet. You still need:
- ✅ Confidence code works
- ✅ Catch bugs early
- ✅ Document expected behavior
- ✅ Quick feedback loop

### Your Approach

**Three Levels of Testing:**

**Level 1: Unit Tests (Functions/Components)**
```javascript
// Test utility function
test('formatDate returns "Jan 1, 2024"', () => {
  expect(formatDate('2024-01-01')).toBe('Jan 1, 2024');
});

// Test component renders
test('Button renders with text', () => {
  const { getByText } = render(<Button>Click me</Button>);
  expect(getByText('Click me')).toBeInTheDocument();
});

// Test form validation
test('Email validation shows error for invalid email', () => {
  const { getByText } = render(<LoginForm />);
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'invalid' }});
  expect(getByText('Invalid email')).toBeInTheDocument();
});
```

**Level 2: Integration Tests (Features Work Together)**
```javascript
// Test create post → see in list
test('Creating a post shows in list', async () => {
  const { getByText, getByPlaceholderText } = render(<PostsPage />);
  
  // Fill form
  fireEvent.change(getByPlaceholderText('Title'), { 
    target: { value: 'My Post' } 
  });
  
  // Submit
  fireEvent.click(getByText('Create'));
  
  // Appears in list
  await waitFor(() => {
    expect(getByText('My Post')).toBeInTheDocument();
  });
});
```

**Level 3: Manual End-to-End**
```
1. Login
2. View posts
3. Create post
4. Comment on post
5. Edit post
6. View dashboard
7. Search/filter
8. Logout
```

**Using Mocks for Tests:**
```javascript
// jest.mock('../../api/implementations', () => ({
//   authAPI: mockAuthAPI,
//   postsAPI: mockPostsAPI,
// }));

test('Login handles API errors', async () => {
  mockAuthAPI.login.mockRejectedValueOnce(new Error('Network error'));
  
  const { getByText } = render(<LoginForm />);
  fireEvent.click(getByText('Login'));
  
  await waitFor(() => {
    expect(getByText('Network error')).toBeInTheDocument();
  });
});
```

---

## DECISION 7: Styling & Design Integration

### The Challenge
You have:
- Figma design to follow
- Responsive mobile-first requirement
- Consistency across components
- Your rsuite MCP can help

### Your Approach

**Option A: Figma Design Tokens + Tailwind**
```
1. Use Figma MCP to extract:
   - Colors (primary, secondary, success, danger)
   - Typography (font family, sizes, weights)
   - Spacing (scale: 4px, 8px, 12px, 16px, ...)
   - Shadows
   - Borders

2. Put in tailwind.config.js:
   colors: {
     primary: '#007AFF',
     secondary: '#5AC8FA',
     ...
   },
   spacing: {
     '1': '4px',
     '2': '8px',
     ...
   }

3. Use Tailwind in components:
   <button className="bg-primary text-white px-4 py-2 rounded">
     Click me
   </button>
```

**Pros:**
- ✅ Extracted from Figma (source of truth)
- ✅ Consistent across app
- ✅ Easy to maintain
- ✅ Fast to build with Tailwind

**Cons:**
- ❌ Setup required
- ❌ Need to extract tokens from Figma

---

**Option B: rsuite Component Library + Tailwind**
```
rsuite gives you:
- Pre-built components (Button, Form, Modal, etc)
- Consistent design
- Accessibility built-in

But Figma design might differ, so:
1. Use rsuite as base
2. Customize with Tailwind when Figma differs
3. Maintain consistency
```

**Your MCP can:**
- Analyze Figma design
- Identify rsuite components that match
- Identify customizations needed
- Generate component code

---

### RECOMMENDATION: **Extract Tokens from Figma + Tailwind + rsuite Hybrid**

**Why?**
- ✅ Figma is source of truth (use your MCP!)
- ✅ rsuite gives solid foundation
- ✅ Tailwind provides flexibility
- ✅ Fastest development

**Workflow:**
1. Use Figma MCP: "Extract all design tokens"
2. Put in tailwind.config.js
3. Use rsuite for component structure
4. Customize rsuite with Tailwind when needed
5. Build faster

---

## DECISION 8: Routing & Navigation

### Your Approach

```javascript
// App.jsx
function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<PostsPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/posts/new" element={<CreatePostPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
```

---

## PART 4: HOW YOUR MCPs HELP

### Figma MCP
**Use for:**
- Extract component specifications
- Get design tokens (colors, spacing, typography)
- Verify your code matches design
- Generate code snippets for components
- Understand responsive breakpoints

**Workflow:**
```
1. Start of Day 1: "Extract all design tokens from Figma"
2. Before building components: "Get specs for Button component"
3. End of each day: "Compare my Button implementation against Figma"
4. When stuck on design: "What are the exact specs for this component?"
```

### Sequential-Thinking MCP
**Use for:**
- Breaking down complex features
- Planning day's work
- Identifying dependencies
- Troubleshooting architectural issues
- Walking through state flow

**Workflow:**
```
"Walk me through the data flow when a user creates a post:
1. User fills form
2. Submits
3. What happens in context?
4. What happens in API layer?
5. What happens in UI?
Use sequential thinking to map it out."
```

### rsuite MCP
**Use for:**
- Understanding rsuite components
- Comparing rsuite to Figma design
- Customizing rsuite for your design
- Getting best practices for rsuite usage

**Workflow:**
```
"I need a form component. Show me:
1. Figma specs for form
2. rsuite Form component
3. How to customize rsuite to match Figma
4. Example code"
```

### Context7 MCP
**Use for:**
- Managing conversation context
- Keeping track of decisions
- Organizing your architectural decisions
- Referencing past decisions

**Workflow:**
```
Use to maintain a running log of:
- Architectural decisions made
- Why each decision was made
- Trade-offs considered
- Results of each decision
```

---

## PART 5: CONCRETE RECOMMENDATIONS & BUILD ORDER

### Day 0 (TODAY) - Architecture & Setup
**What to do:**
1. ✅ **Finalize API Contract** (this document helps!)
2. ✅ **Extract Figma Design Tokens** (use Figma MCP)
3. ✅ **Set up project structure** (folder structure above)
4. ✅ **Create mock API layer** (abstract + mock impl)
5. ✅ **Setup Tailwind + rsuite**
6. ✅ **Create a few common components** (Button, Card, Input)

**Don't start:**
- ❌ Building full features
- ❌ Complex state management setup
- ❌ Extensive testing yet

**Deliverable:** Project that builds, folder structure clear, mock API ready

---

### Day 1 - Foundation & Auth
**What to build:**
1. ✅ **AuthContext** (state management)
2. ✅ **useAuth hook** (custom hook)
3. ✅ **Login page** (form + validation)
4. ✅ **Register page** (form + validation)
5. ✅ **ProtectedRoute** (route guard)
6. ✅ **Navigation layout** (header with user info)

**Using:**
- Context API (auth state)
- React Hook Form (form validation)
- Mock auth API
- Tailwind styling

**Testing:**
- Can login with default credentials
- Token persists on refresh
- Can't access protected pages without login
- Logout works

---

### Day 2 - Core Features (Posts & Comments)
**What to build:**
1. ✅ **PostContext** (state management)
2. ✅ **usePosts hook** (custom hook)
3. ✅ **PostList component** (display posts)
4. ✅ **PostDetail component** (single post)
5. ✅ **CreatePost form** (form + validation)
6. ✅ **CommentForm & CommentList** (comments)
7. ✅ **CategoryFilter** (filter UI)

**Using:**
- Context API (post state)
- Mock post/comment API
- React Hook Form (create/edit forms)
- Tailwind styling

**Testing:**
- Create post → see in list
- Edit post → updates
- Delete post → disappears
- Add comment → appears
- Filter by category → works

---

### Day 3 - Advanced Features & Polish
**What to build:**
1. ✅ **SearchBar** (search + debounce)
2. ✅ **Analytics Dashboard** (charts + stats)
3. ✅ **Responsive design** (mobile/tablet/desktop)
4. ✅ **Loading & error states** (skeleton, errors)
5. ✅ **Test suite** (unit + integration tests)

**Using:**
- React Query (upgrade from Context if ready)
- Recharts (charts)
- Mock analytics API
- Jest + React Testing Library

**Testing:**
- Responsive on all screen sizes
- Search works with debounce
- Dashboard loads and displays data
- All tests passing
- No console errors

---

### Day 4 - Final Polish & Ready to Ship
**What to do:**
1. ✅ **Code review** (self-review)
2. ✅ **Bug fixes** (any edge cases)
3. ✅ **Documentation** (README, components)
4. ✅ **Final testing** (browser compat, accessibility)
5. ✅ **Demo prep** (test scripts, sample data)

**Result:** Production-ready code, ready to integrate real backend

---

## SUMMARY: Your Architecture

```
┌─ FOUNDATION (Day 0)
│  ├─ API Contracts (abstract + mock)
│  ├─ Folder Structure (components/features/common)
│  ├─ Design Tokens (from Figma)
│  └─ Common Components (Button, Card, Input)
│
├─ STATE MANAGEMENT (Days 1-2)
│  ├─ Auth: Context API + useAuth hook
│  ├─ Posts: Context API + usePosts hook (upgrade to React Query Day 3)
│  └─ UI: useState for component-specific
│
├─ FORMS (Days 1-2)
│  ├─ Use React Hook Form
│  ├─ Client-side validation
│  └─ Server-side error handling
│
├─ STYLING (Throughout)
│  ├─ Tailwind for utility classes
│  ├─ rsuite for components
│  └─ Design tokens from Figma
│
├─ TESTING (Day 3-4)
│  ├─ Unit tests (functions/components)
│  ├─ Integration tests (features together)
│  └─ Manual E2E (create/read/update/delete flow)
│
└─ READY FOR BACKEND INTEGRATION
   └─ Swap mock implementations with real API
```

---

## NEXT STEPS

1. **Clarify API Contract** with backend engineer Bruce
   - "Are these the endpoint shapes?"
   - "Are these the error response formats?"
   
2. **Extract Design Tokens** from Figma using your Figma MCP
   - Colors, spacing, typography, shadows
   
3. **Create the mock API layer** with realistic data
   
4. **Build the project structure** with empty folders
   
5. **Start Day 1** with auth system

---

**Would you like me to:**
1. Deep-dive into any of these decisions?
2. Create the mock API implementation details?
3. Create the API contract specification?
4. Create the folder structure as actual code?
5. Walk through a complete example (e.g., create post flow)?

Let me know what's most helpful!
