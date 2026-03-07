# CommunityBoard Frontend — Getting Started Checklist

You now have **3 comprehensive guides** designed to help you build this project independently with full understanding and control.

---

## YOUR 3 DOCUMENTS

### 1. **communityboard-frontend-prompt.md** (Main Guide)
**Use when:** You're ready to start building or need guidance on a specific feature

**Contains:**
- Day-by-day roadmap (4 days breakdown)
- What to build each day
- Key concepts to learn
- What depends on what
- Blockers to watch for
- Testing strategy
- Success criteria

**How to use:**
- Read the Day you're working on
- Copy that section into Claude chat
- Ask specific questions about deliverables
- Claude will provide code + explanations

**Length:** ~15 pages of detailed guidance

---

### 2. **how-to-use-the-prompt.md** (Quick Start Guide)
**Use when:** You don't know how to ask Claude for help

**Contains:**
- Step-by-step examples of how to use the main prompt
- Common scenarios (feature building, troubleshooting, learning concepts)
- Best practices for getting help
- What NOT to ask Claude for
- Emergency help template (when totally stuck)

**How to use:**
- Read this first (15 min read)
- When you hit a blocker, look up "How do I ask about this?"
- Copy-paste the example structure
- Customize with your situation

**Length:** ~8 pages, practical examples

---

### 3. **technical-architecture.md** (Big Picture)
**Use when:** You want to understand how everything connects

**Contains:**
- System architecture diagram
- Dependency graph (what depends on what)
- Data flow diagrams
- Integration points with backend
- Build order (what to code in what order)
- Technical decisions you'll make
- Common patterns used in project
- Performance considerations

**How to use:**
- Read before Day 1 (understand the big picture)
- Reference when confused about dependencies
- Use as reference when designing components

**Length:** ~12 pages, lots of diagrams and examples

---

## 4-DAY BUILDING PLAN

### Day 1: Foundation & Auth (4-6 hours)
**What:** Build authentication system
**Deliverables:** Login, register, auth context, protected routes
**Key File:** communityboard-frontend-prompt.md → "DAY 1" section
**Resources:** Technical architecture → "Build Order Session 1"

```
Morning: Setup + API layer
Afternoon: Auth system
Evening: Test + commit
```

---

### Day 2: Core Features (4-6 hours)
**What:** Posts and comments CRUD
**Deliverables:** Post list, detail, create/edit, comments
**Key File:** communityboard-frontend-prompt.md → "DAY 2" section
**Resources:** Technical architecture → "Build Order Session 2"

```
Morning: Post service + context
Afternoon: Components (list, detail, create)
Evening: Comments + test + commit
```

---

### Day 3: Advanced Features (4-6 hours)
**What:** Search, filter, analytics, polish
**Deliverables:** Search/filter UI, dashboard, responsive design, tests
**Key File:** communityboard-frontend-prompt.md → "DAY 3" section
**Resources:** Technical architecture → "Build Order Session 3"

```
Morning: Search/filter + analytics
Afternoon: Dashboard + layout + responsive
Evening: Tests + optimization + commit
```

---

### Day 4: Final Polish (2-4 hours)
**What:** Bug fixes, documentation, demo prep
**Deliverables:** Clean code, full docs, ready for demo
**Key File:** communityboard-frontend-prompt.md → "DAY 4" section
**Resources:** Technical architecture → "Deployment Checklist"

```
Morning: Code review + refactor + bug fixes
Afternoon: Docs + final testing
Evening: Demo prep + commit
```

---

## HOW TO APPROACH THIS

### The Right Way (Learning + Independence)
1. **Read** the relevant section from the prompt
2. **Understand** what you're building (read "Key Concepts to Understand")
3. **Ask Claude** for guidance (use how-to-use guide for examples)
4. **Type the code yourself** (don't copy-paste blind)
5. **Test it** (verify it works)
6. **Ask Claude** why it works (explain it back)
7. **Move to next** deliverable

**Time:** ~6 hours per day, but you'll **own** the code

---

### The Wrong Way (Blind Copy-Paste)
1. Ask Claude for code
2. Copy-paste without reading
3. It works but you don't understand why
4. Next blocker you're stuck
5. Days 3-4 you're scrambling

**Time:** ~4 hours per day, but you won't **own** the code

---

## BEFORE YOU START

### ✅ Prerequisites Checklist
- [ ] Read this entire checklist
- [ ] Skim "how-to-use-the-prompt.md" (understand structure)
- [ ] Read "technical-architecture.md" (understand big picture)
- [ ] Review project requirements in Project-Description.pdf
- [ ] Review Figma design (understand what you're building)
- [ ] Clone starter code from GitHub
- [ ] Set up local development environment (Node, npm, Docker, etc)
- [ ] Review backend API documentation (from backend engineer)
- [ ] Understand default credentials for testing

---

### ✅ First Day Setup (Before 9 AM)
- [ ] Save all 3 PDF documents in your project folder
- [ ] Review Day 1 section of main prompt
- [ ] Understand folder structure (from technical-architecture.md)
- [ ] Get backend API endpoint list from Bruce (backend engineer)
- [ ] Confirm Figma design access
- [ ] Set up `.env` file with API base URL
- [ ] First standup: Communicate with team on blockers

---

## FAQ

**Q: Can I just copy-paste the prompt to Claude as-is?**
A: Yes, but it's too much at once. Better to copy just the Day/section you're working on, then ask your specific question.

---

**Q: What if I get stuck?**
A: See "EMERGENCY HELP" in how-to-use-the-prompt.md. Describe what you expected vs what happened.

---

**Q: How do I know if I'm learning enough?**
A: Use the "CRITICAL LEARNING CHECKPOINTS" section in main prompt. By end of each day, you should understand the concepts listed.

---

**Q: What if the backend API isn't ready?**
A: Coordinate with backend engineer (Bruce). Use mock data in your context to unblock yourself. See "Blockers" section in Day 2.

---

**Q: Should I use React Query or Context API?**
A: Start with Context API (simpler, faster to learn). Upgrade to React Query on Day 3 if backend is stable. See technical-architecture.md for decision table.

---

**Q: How much time should each day actually take?**
A: 4-6 hours per day if you're understanding code. Don't rush. Better to truly understand Day 1 auth than blindly code Day 2-4.

---

**Q: Can I work on multiple features in parallel?**
A: Not recommended. Dependencies mean Feature B won't work without Feature A done. Follow build order strictly.

---

**Q: What if I finish early?**
A: Work on stretch goals (image upload, email notifications, dark mode). See end of Day 4 section in main prompt.

---

**Q: Should I test everything or let QA find bugs?**
A: You should test happy path + basic error cases. QA tests edge cases and comprehensive coverage. See "Testing Strategy" in technical-architecture.md.

---

**Q: How do I handle disagreements with the Figma design?**
A: Ask design questions in team standup. Or use best judgment and document decision. DevOps/data/QA teams won't block you on UI tweaks.

---

## DAILY STANDUP TEMPLATE

Use this every morning (5 minutes):

```
**Yesterday's Progress:**
- Completed: [list features/code]
- Blockers encountered: [list any blockers]
- Time spent: [estimate]

**Today's Plan:**
- Will complete: [features]
- Need from team: [clarifications/data/unblocks]

**Blockers/Asks:**
- [specific ask to backend/QA/data/devops engineer]
```

---

## COMMUNICATION CHECKLIST

### Daily
- [ ] Attend standup (5 min)
- [ ] Check Slack for team messages
- [ ] Update GitHub Projects board (Kanban)

### When Blocked
- [ ] Ask in Slack/standup first
- [ ] Wait max 15 min for response
- [ ] If no response, work around it (mock data, ask Claude)
- [ ] Document the blocker

### End of Day
- [ ] Commit code with clear message
- [ ] Update project log with progress
- [ ] Note what you learned
- [ ] Note what you're confused about (for next day)

---

## GIT WORKFLOW CHECKLIST

### Each Feature
```bash
git checkout -b feature/auth-system          # Create branch
# ... write code ...
git add .                                    # Stage changes
git commit -m "feat: implement JWT auth"     # Commit with message
git push origin feature/auth-system           # Push to GitHub
# Create Pull Request on GitHub
# Get reviewed
# Merge to main
```

### Commit Message Format
```
feat: add authentication system               # New feature
fix: resolve login redirect issue             # Bug fix
docs: add auth section to README              # Documentation
refactor: simplify post context logic         # Code improvement
test: add auth context tests                  # Tests
```

---

## RESOURCES YOU HAVE

### Documentation
- ✅ communityboard-frontend-prompt.md (day-by-day guide)
- ✅ how-to-use-the-prompt.md (how to ask Claude)
- ✅ technical-architecture.md (big picture + patterns)
- ✅ Project-Description.pdf (requirements)
- ✅ Figma design (UI reference)
- ✅ GitHub starter code (base to build on)

### People
- **Backend Engineer:** Bruce (Java/Spring Boot questions)
- **QA Engineer:** Divine (testing, test cases)
- **Data Engineer:** Ernest (analytics data format)
- **DevOps Engineer:** Joel (Docker, CI/CD, deployment)
- **Product Owner:** Lute (requirements clarification)
- **Claude:** Available 24/7 for technical help

### Tools
- Claude (AI coding assistant) — Use for any code questions
- Figma (design) — Reference constantly
- GitHub (version control) — Your source of truth
- Postman/Thunder Client (API testing) — Test backend before building UI
- Docker (local dev environment) — Run backend locally
- Jest + React Testing Library (testing) — Write tests as you build

---

## SUCCESS METRICS (How You Know You're on Track)

### Day 1 End
- [ ] Can log in with provided credentials
- [ ] Token persists after page refresh
- [ ] Can't access protected pages without logging in
- [ ] Logout works and redirects to login
- [ ] Code is organized in folder structure from architecture doc
- [ ] At least basic unit tests for auth
- [ ] Committed code to GitHub

### Day 2 End
- [ ] Can create, read, update, delete posts
- [ ] Can add comments to posts
- [ ] Can filter by category
- [ ] PostList shows posts from backend
- [ ] Can edit only own posts (or as admin)
- [ ] Error messages show when something fails
- [ ] Tests passing for post CRUD
- [ ] Committed code to GitHub

### Day 3 End
- [ ] Search works (with debounce)
- [ ] Category + date filters work
- [ ] Analytics dashboard shows data
- [ ] Design responsive (mobile/tablet/desktop work)
- [ ] No console errors or warnings
- [ ] 70%+ test coverage on components
- [ ] Code is well-organized and clean
- [ ] Documentation updated
- [ ] Committed code to GitHub

### Day 4 End
- [ ] All bugs fixed
- [ ] Code is production-ready (no TODOs, no dead code)
- [ ] Full documentation complete
- [ ] Can demo all features end-to-end
- [ ] Pull request created with full description
- [ ] Code reviewed by team
- [ ] Ready to push to main and deploy

---

## THE BIG PICTURE

You have 4 days to build a production-quality frontend for a community board app.

**Your approach:**
1. **Understand** (read docs, understand architecture)
2. **Build incrementally** (Day 1 foundation, Day 2 features, Day 3 polish)
3. **Learn as you build** (ask Claude to explain, not just code)
4. **Test thoroughly** (unit tests + manual testing)
5. **Document clearly** (so team understands your code)
6. **Deliver with confidence** (you own this code)

**Your mindset:**
- ✅ Curious (ask why, don't just follow)
- ✅ Thorough (understand before moving forward)
- ✅ Collaborative (communicate blockers early)
- ✅ Confident (you can do this)

---

## FINAL CHECKLIST BEFORE STARTING

- [ ] Saved all 3 documents
- [ ] Read how-to-use guide
- [ ] Reviewed technical architecture
- [ ] Understand build order
- [ ] Have backend API docs
- [ ] Have Figma design open
- [ ] Local environment set up
- [ ] First feature ready to start
- [ ] Team contact info saved (Slack, email)
- [ ] Ready to ask Claude for help using examples from guide

---

## YOU'VE GOT THIS 🚀

This is a real, production-quality project. In 4 days, you'll have:
- ✅ Fully functional frontend
- ✅ Deep understanding of React patterns
- ✅ Collaborative experience with team
- ✅ Portfolio-worthy code
- ✅ Real skills you'll use in your career

Take it one day at a time. Ask for help when stuck. Learn deeply. Build with intent.

By Day 4, you'll be proud of what you built.

Let's go! 💪

---

**Questions?** Check how-to-use-prompt.md or ask your team in standup.
