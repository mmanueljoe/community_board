# How to Use the CommunityBoard Frontend Prompt — Quick Start Guide

## TL;DR
1. Save the `communityboard-frontend-prompt.md` file
2. Before asking Claude for help on any part of the project, copy the relevant section from the prompt
3. Paste it into your Claude conversation
4. Add your specific question/blockers below it
5. Claude will respond with code, explanations, and learning guidance tailored to that section

---

## The Prompt Structure

The main prompt is organized into **4 sections** matching the **4 days of development:**

- **Day 1:** Foundation & Authentication
- **Day 2:** Core Features (Posts & Comments)
- **Day 3:** Search, Analytics & Polish
- **Day 4:** Final Polish, Testing & Delivery

Each day includes:
- What you'll **learn**
- **Deliverables** (what to build)
- **Key concepts** to understand
- **Blockers** to watch for

---

## HOW TO USE THE PROMPT: Step-by-Step

### SCENARIO 1: You're Working on Day 1 — Auth System

**What you do:**
1. Read the **Day 1** section in the prompt
2. Decide which sub-task to start with (e.g., "API Service Layer")
3. Copy that sub-task's section from the prompt
4. Paste into Claude chat and ask:

```
[Paste the "API Service Layer" section from the prompt]

Now I'm building this. Can you:
1. Show me a complete, production-ready axios instance with JWT interceptors
2. Explain each part (why we need request interceptor, what response interceptor does, error handling)
3. Show me how to handle token refresh when token expires
4. Give me tests to ensure it works
5. What security considerations should I keep in mind?
```

**What Claude does:**
- Provides full code with inline comments
- Explains the "why" for each decision
- Shows how it connects to other parts (AuthContext, login page, etc.)
- Warns about gotchas (localStorage security, token expiry, CORS, etc.)
- Gives you tests to verify it works

---

### SCENARIO 2: You're Stuck on a Specific Problem

**What you do:**
1. Find the relevant section in the prompt (e.g., "Login & Register Pages")
2. Paste that section
3. Describe your problem:

```
[Paste the "Login & Register Pages" section]

I'm stuck: When I submit the login form, the request goes to the API, 
but the response says "401 Unauthorized" even though credentials are correct.

Here's my login code:
[paste your code]

Expected: Token saved, redirect to dashboard
Actual: 401 error, nothing saved

Can you:
1. Identify what's wrong
2. Show me the fix
3. Explain why this happens
```

**What Claude does:**
- Diagnoses the issue (maybe token format is wrong, maybe auth header is wrong, etc.)
- Provides the fix with explanation
- Shows you what to check (backend response format, axios config, etc.)
- Helps you prevent similar issues

---

### SCENARIO 3: You're Confused About a Concept

**What you do:**
1. Find the "Key Concepts to Understand" section for that day
2. Paste the concept you're confused about
3. Ask Claude:

```
[Paste: "CRITICAL LEARNING CHECKPOINTS"]

I'm confused about "Why Context API is suitable for auth state (and when you'd outgrow it)".

Can you:
1. Explain what Context API is doing in this project
2. Why Redux would be overkill
3. When I'd switch to Redux in a bigger project
4. Real example from our CommunityBoard app
```

**What Claude does:**
- Explains in beginner-friendly language (no jargon assumed)
- Shows before/after code
- Draws the line when Context breaks down
- Gives you intuition you'll use forever

---

## BEST PRACTICES FOR USING THE PROMPT

### 1. **Copy the Exact Section You're Working On**
Don't give Claude the whole prompt at once. Too much context = less focused help.
- Working on auth? → Copy Day 1 section
- Building posts? → Copy Day 2 section
- Stuck on one thing? → Copy just that deliverable

### 2. **Always Add Context About Your Situation**
```
✗ Bad: "How do I build auth?"
✓ Good: "I'm on Day 1, auth system. Here's what I've built so far: [code]. 
         I'm stuck on [specific problem]. Can you help?"
```

### 3. **Ask for Explanation, Not Just Code**
```
✗ Bad: "Give me code for login page"
✓ Good: "Show me login page code. For each major part, explain:
         - Why you chose that approach
         - What would break if I changed it
         - How to test it"
```

### 4. **Use This When You're Confused**
If something doesn't make sense after Claude explains:
- Ask for an analogy
- Ask for a simpler example
- Ask "why" again
- Ask what the alternative would be

```
"I don't understand why we need React Query in Day 3.
Why isn't Context API enough? What problem are we solving?"
```

### 5. **Use This When You're Stuck**
Describe:
- What you expected to happen
- What actually happened
- Code you tried
- Error message (if any)
- What you've already tried

```
"Expected: Form validates empty title field
Actual: Form submits empty title without error
Code: [paste]
Error: None, it just submits
I tried: [what you changed]"
```

---

## PROMPT SECTIONS QUICK REFERENCE

### Use CONTEXT & ROLE section when:
- You want Claude to understand your skill level and project scope
- You want Claude to adapt tone (teach, don't just code-dump)
- First time conversation with Claude on this project

### Use PROJECT SCOPE section when:
- You're confused what's MVP vs stretch goals
- You want to understand dependencies between features
- You need to coordinate with other team members

### Use ROADMAP section when:
- You want to understand "what depends on what"
- You're planning your day
- You want to see the big picture

### Use DAY [1-4] sections when:
- You're actively building that day's features
- You want to know what to build next
- You want learning guidance for that day's concepts

### Use LEARNING CHECKPOINTS section when:
- You want to self-assess (do I understand this?)
- You finished a day and want to verify readiness for next
- You're confused and want to know what prerequisite you're missing

### Use CRITICAL TOOLS section when:
- You want recommendations on what library to use
- You're deciding between packages
- You want to know what's essential vs optional

### Use BLOCKERS section when:
- You hit an error or issue
- You want to know common problems for that day
- You want to prevent issues before they happen

---

## EXAMPLE: Working Through Day 2

**Your situation:** It's Day 2. You finished auth on Day 1. Now you're building the post list.

**Step 1: Review the deliverables**
- Open the prompt
- Read Day 2 deliverables
- Decide to start with "Post Service Layer"

**Step 2: Ask Claude**
```
[Copy the "Post Service Layer" subsection from the prompt]

I'm on Day 2, building post list. Starting with the post service.
I've reviewed the project README and understand the backend API endpoints.

Can you:
1. Show me a complete postService.js with all CRUD methods
2. For each method, explain:
   - What this does
   - How it's different from authService
   - What the backend expects (request shape)
   - What the backend returns (response shape)
   - How the frontend will use it
3. Give me a mock version so I can test without a real backend
4. How should I handle errors in the service layer?
```

**Step 3: Implement and test**
- Claude gives you code
- You understand each part (not just copy)
- You test it works
- You move to next deliverable ("Post Context or React Query")

**Step 4: When stuck**
```
[Copy "Post Context or React Query" subsection]

I'm trying to use Context API for posts (Option B).
Here's my PostContext:
[paste code]

Expected: getPosts() returns array of posts
Actual: getPosts() returns undefined

Can you:
1. Find the bug
2. Explain what went wrong
3. Show me how to test this works
```

**Step 5: Continue**
- Move through each deliverable
- Ask Claude for help on each
- Build confidence as you understand more

---

## WHEN TO ASK FOR HELP

### ✅ Good Times to Ask Claude:
- Before you start a feature ("Show me the approach")
- When you're stuck for 10+ minutes
- When you don't understand why something works
- When you want code reviewed
- When you need to learn a concept
- When you hit an error you don't understand
- When something works but feels hacky

### ❌ Don't Ask for:
- Line-by-line debugging (debug it first, then ask)
- Copy-paste without understanding (understand first, copy second)
- To do the whole project for you (you need to write code to learn)

---

## PROGRESS TRACKING

Print this out and check off as you go:

**Day 1: Auth System**
- [ ] Folder structure setup
- [ ] API service layer (axios + interceptors)
- [ ] Auth context
- [ ] Protected routes
- [ ] Login page
- [ ] Register page
- [ ] Manual testing
- [ ] Unit tests
- [ ] Git commit

**Day 2: Posts & Comments**
- [ ] Post service
- [ ] Post context or React Query
- [ ] Post list component
- [ ] Post detail component
- [ ] Create post
- [ ] Edit post
- [ ] Category filter
- [ ] Comment system
- [ ] E2E testing
- [ ] Git commit

**Day 3: Search, Analytics & Polish**
- [ ] Search & filter
- [ ] Analytics dashboard
- [ ] Navigation layout
- [ ] Responsive design
- [ ] Loading/error states
- [ ] Component library
- [ ] Test suite
- [ ] Performance optimization
- [ ] Documentation
- [ ] Git commit

**Day 4: Final Polish & Delivery**
- [ ] Code review & refactoring
- [ ] Bug fixes & edge cases
- [ ] Accessibility check
- [ ] Browser/device testing
- [ ] Final documentation
- [ ] Git PR with checklist
- [ ] Demo preparation
- [ ] Team handoff

---

## TIPS FOR MAXIMUM LEARNING

1. **Type code yourself, don't copy-paste**
   - Reading code ≠ writing code
   - Your fingers need to learn the patterns

2. **Explain it back to Claude**
   ```
   "So what I understand is:
   - We use Context for auth because [reason]
   - We store token in localStorage because [reason]
   - We use interceptor to add token because [reason]
   - Is this right?"
   ```

3. **Modify the code after understanding**
   - Try changing it
   - See what breaks
   - Understand why it broke

4. **Test before asking for help**
   - 80% of issues you'll debug yourself
   - This builds real engineering skills
   - Only ask Claude after you've tried

5. **Build one small thing at a time**
   - Don't wait until end of day to test
   - Test after each small feature
   - Bugs are easier to find this way

---

## EMERGENCY HELP (When Totally Stuck)

If you're stuck and don't know what to ask:

```
I'm on [Day X, Feature Y].
Here's what I was trying to do: [description]

I've tried: [what you tried]

Error message: [full error or describe what happens]

I don't even know what to ask. Can you:
1. Identify what went wrong
2. Explain the root cause
3. Show me the fix
4. Teach me how to prevent this
```

Claude will take it from there.

---

## FILE ORGANIZATION

Save these files in your project:

```
project/
├── communityboard-frontend-prompt.md  ← Main prompt (reference often)
├── this-file.md                        ← This quick start guide
├── DAILY_PROGRESS.md                   ← Track what you've done
├── LEARNING_NOTES.md                   ← Write what you learned
└── [rest of your project]
```

---

## FINAL ADVICE

**This prompt is a tool, not a crutch.** Use it to:
- ✅ Understand concepts deeply
- ✅ Learn the right way to build features
- ✅ Unblock yourself when stuck
- ✅ Build with confidence and intent

Don't use it to:
- ❌ Avoid thinking
- ❌ Copy code without understanding
- ❌ Guess without learning
- ❌ Rush through implementation

**You own this code.** By Day 4, you should be able to explain every decision, every line, and hand it off to someone else with confidence.

Good luck! You've got this. 🚀
