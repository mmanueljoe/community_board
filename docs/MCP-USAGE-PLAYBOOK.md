# CommunityBoard Frontend — MCP Usage Playbook
## Practical Workflows for Your MCP Servers

**Your MCPs:**
- `figma` → Design specifications
- `sequential-thinking` → Complex problem-solving
- `rsuite` → Component library reference
- `context7` → Conversation context management

---

## PART 1: FIGMA MCP WORKFLOW

### What Figma MCP Does
Extracts design specifications, components, colors, spacing, typography from your Figma design file.

### When to Use Figma MCP
- [ ] Before building components (extract specs)
- [ ] To get design tokens (colors, spacing, typography)
- [ ] To verify UI matches design
- [ ] To understand responsive breakpoints
- [ ] To generate component code from design

---

## WORKFLOW 1: Extract All Design Tokens (Day 0 - 30 min)

**Goal:** Get colors, spacing, typography, shadows from Figma once, use everywhere

**Your Prompt to Figma MCP:**

```
I have a Figma design for a community board app.
Can you extract and give me:

1. Color palette (all colors used)
   - Include color names, hex values, usage (primary, secondary, etc)
   
2. Typography system
   - Font families used
   - Font sizes and their names (h1, h2, body, small, etc)
   - Font weights
   - Line heights
   - Letter spacing
   
3. Spacing/Scale
   - All spacing values used (padding, margins, gaps)
   - Provide as a scale (1x = 4px, 2x = 8px, etc)
   
4. Shadows
   - All drop shadows/elevations used
   - Names and CSS values
   
5. Border radius
   - All border radius values used

Format as JSON so I can put directly in tailwind.config.js
```

**Figma MCP Response:** (You'll get JSON with all tokens)

**Next Step:** Put in tailwind.config.js

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      // From Figma
      primary: '#007AFF',
      secondary: '#5AC8FA',
      success: '#34C759',
      danger: '#FF3B30',
      warning: '#FF9500',
      // ... more
    },
    spacing: {
      // From Figma
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      // ... more
    },
    fontSize: {
      // From Figma
      'xs': ['12px', { lineHeight: '16px' }],
      'sm': ['14px', { lineHeight: '20px' }],
      'base': ['16px', { lineHeight: '24px' }],
      'lg': ['18px', { lineHeight: '28px' }],
      'xl': ['20px', { lineHeight: '28px' }],
      // ... more
    },
    // ... more
  },
}
```

**Result:** Design tokens in code, consistent across app

---

## WORKFLOW 2: Extract Component Specifications (Day 0/1 - Before Building Each Component)

**Goal:** Get exact specs for Button, Form, Card, etc before building

**Your Prompt to Figma MCP:**

```
Show me the specifications for the [COMPONENT_NAME] component in my design:

1. Visual specs
   - Dimensions (width, height if fixed)
   - Padding/margins
   - Border radius
   - Border/outline (if any)
   
2. States
   - Default state
   - Hover state
   - Active/pressed state
   - Disabled state
   - Loading state (if applicable)
   - Error state (if applicable)
   
3. Typography
   - Font family, size, weight
   - Line height
   - Letter spacing
   
4. Colors
   - Background color
   - Text color
   - Border color
   - Colors for each state
   
5. Icons/Images
   - Icon sizes
   - Icon placement
   - Spacing from text
   
6. Responsive behavior
   - How it changes on mobile
   - How it changes on tablet
   - How it changes on desktop

Format as a structured guide I can use to build the component.
```

**Example: Button Component Specs**

```
Button Component Specs (from Figma):

DEFAULT STATE:
- Background: primary (#007AFF)
- Text: white (#FFFFFF)
- Padding: 12px 24px (vertical/horizontal)
- Border radius: 8px
- Font: 16px, weight 600, line height 24px
- Min height: 44px (touch target)

HOVER STATE:
- Background: primary darker (use rgba opacity 0.9)
- Cursor: pointer

ACTIVE/PRESSED STATE:
- Background: primary darker (use rgba opacity 0.8)
- Box shadow: inset shadow

DISABLED STATE:
- Background: gray-300 (#E5E5EA)
- Text: gray-500 (#999999)
- Cursor: not-allowed
- Opacity: 0.6

VARIANTS:
- Primary (blue) - default
- Secondary (light gray background, blue text)
- Danger (red background)
- Ghost (transparent background, text color)

SIZES:
- Small: 8px 16px padding, 14px font
- Medium: 12px 24px padding, 16px font (default)
- Large: 16px 32px padding, 18px font

RESPONSIVE:
- Mobile: full width
- Desktop: auto width
```

**Result:** You have exact specs, build with confidence

---

## WORKFLOW 3: Verify Implementation Against Design (Daily - Before Committing)

**Goal:** Make sure what you built matches Figma

**Your Prompt to Figma MCP:**

```
I built a Button component. Here's my code:
[PASTE YOUR CODE]

Can you compare it against the Figma design specs:

1. Visual comparison
   - Does my styling match Figma?
   - Are colors correct?
   - Are spacing/padding correct?
   - Is border radius correct?
   
2. State comparison
   - Do all states (hover, active, disabled) match?
   - Are transitions smooth?
   
3. Responsive comparison
   - Does it look right on mobile?
   - Does it look right on desktop?
   
4. Missing things
   - What did I miss or get wrong?
   - What should I fix?
   
5. Suggestions
   - How can I improve it?

Be specific about what to fix.
```

**Figma MCP Response:** (You'll get specific fixes needed)

**Result:** Code matches design exactly

---

## WORKFLOW 4: Extract Responsive Breakpoints (Day 0)

**Goal:** Know exact breakpoints from Figma

**Your Prompt to Figma MCP:**

```
What are the responsive breakpoints used in your Figma design?

For each breakpoint:
- Name (mobile, tablet, desktop)
- Pixel width
- Any layout changes at this breakpoint
- Any spacing changes
- Any typography changes

Format as breakpoints I can use in Tailwind.
```

**Figma MCP Response:** (You'll get breakpoints)

```
Breakpoints from Figma:
- Mobile: 375px (iPhone)
- Tablet: 768px (iPad)
- Desktop: 1024px
- Large Desktop: 1440px

At each breakpoint, the layout changes...
```

**Put in tailwind.config.js:**

```javascript
module.exports = {
  theme: {
    screens: {
      'sm': '375px',   // Mobile
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1440px',  // Large desktop
    },
  },
}
```

---

## WORKFLOW 5: Generate Component Code from Design (Optional - Day 1/2)

**Goal:** Get starter code directly from Figma

**Your Prompt to Figma MCP:**

```
Generate React JSX code for the [COMPONENT] component based on Figma specs:

Requirements:
- Use React functional component with hooks if needed
- Use Tailwind CSS for styling
- Include all states (default, hover, active, disabled)
- Use TypeScript interfaces for props
- Include JSDoc comments
- Make it production-ready

Generate starter code I can copy into my project.
```

**Figma MCP Response:** (You'll get React component code)

**Result:** Faster component building

---

## PART 2: SEQUENTIAL-THINKING MCP WORKFLOW

### What Sequential-Thinking MCP Does
Breaks down complex problems step-by-step, useful for planning, architecture, debugging.

### When to Use Sequential-Thinking MCP
- [ ] Planning day's work (break into steps)
- [ ] Understanding data flows
- [ ] Debugging complex issues
- [ ] Understanding dependencies
- [ ] Planning architectural changes

---

## WORKFLOW 1: Plan Day's Work (Every Morning - 5 min)

**Goal:** Break today's work into clear steps

**Your Prompt:**

```
I'm working on [FEATURE] today for CommunityBoard frontend.
The feature is: [DESCRIPTION]

Can you break this down into concrete steps?

For each step, tell me:
1. What to do
2. What depends on previous steps
3. How to test it
4. Estimated time
5. What could go wrong

Structure it so I can execute step-by-step without getting blocked.
```

**Sequential-Thinking Response:**

```
Breaking down "Create Post Feature":

STEP 1: Create PostContext hook (30 min)
- Depends on: API contract finalized
- Why: Manages post data state
- Test: Can call createPost(), posts array updates
- Risk: API shape might not match assumptions
- Recovery: Have API contract ready, coordinate with backend

STEP 2: Build CreatePost form component (45 min)
- Depends on: PostContext working
- Why: UI for user to enter post data
- Test: Form validates, submits, calls PostContext.createPost()
- Risk: Form validation logic complex
- Recovery: Use React Hook Form library

STEP 3: Connect to PostList (20 min)
- Depends on: CreatePost form and PostList component
- Why: New post appears in list
- Test: Create post → appears in PostList
- Risk: PostList doesn't refetch/update
- Recovery: Ensure PostContext refetches after create

STEP 4: Test happy path (15 min)
- Depends on: All above working
- Test: Create post, see in list, edit, delete
```

**Result:** Clear execution path, no confusion

---

## WORKFLOW 2: Understand Data Flow (When Confused)

**Goal:** Understand how data moves through app

**Your Prompt:**

```
Walk me through the data flow for [SCENARIO] step-by-step.

Scenario: User creates a post

Show me:
1. Where does it start (User action)
2. What React component handles it
3. What hooks/state management involved
4. What API calls made
5. What happens in backend (conceptually)
6. What comes back to frontend
7. What components rerender
8. What user sees

Use sequential thinking to map the complete flow.
```

**Sequential-Thinking Response:**

```
Data flow for "Create Post":

STEP 1: User fills form in CreatePost component
  └─ Title, content, category entered
  └─ useState tracks form values

STEP 2: User clicks "Create Post"
  └─ Form validation runs (client-side)
  └─ If valid, calls handleSubmit

STEP 3: handleSubmit calls PostContext.createPost()
  └─ Sets isLoading: true (show loading spinner)
  └─ Calls postService.createPost(data)

STEP 4: postService calls API.posts.createPost()
  └─ Makes HTTP request to POST /api/posts
  └─ Includes user token for authentication

STEP 5: Backend receives request
  └─ Validates data
  └─ Creates post in database
  └─ Returns created post object

STEP 6: Frontend receives response
  └─ PostContext saves new post to state
  └─ Updates posts array: [newPost, ...oldPosts]
  └─ Sets isLoading: false

STEP 7: Components rerender
  └─ CreatePost form resets
  └─ PostList rerenders with new post at top
  └─ Shows success toast notification

STEP 8: User sees result
  └─ New post appears at top of list
  └─ Form cleared for next post
  └─ Toast says "Post created!"
```

**Result:** You understand the complete flow

---

## WORKFLOW 3: Debug Complex Issues

**Goal:** Find root cause of confusing bugs

**Your Prompt:**

```
I have a bug: [DESCRIPTION]

Expected: [WHAT SHOULD HAPPEN]
Actual: [WHAT ACTUALLY HAPPENS]
Error: [IF ANY ERROR MESSAGE]

Code: [RELEVANT CODE]

Can you walk through the code step-by-step to find where it breaks?

For each step:
1. What happens
2. What should happen
3. Where does it diverge
4. Why it diverges
5. How to fix it
```

**Sequential-Thinking Response:** (Walks through code step-by-step)

**Result:** You find and fix the bug

---

## PART 3: RSUITE MCP WORKFLOW

### What rsuite MCP Does
References rsuite component library, shows how to use components, matches with Figma design.

### When to Use rsuite MCP
- [ ] Building a component (which rsuite component to use)
- [ ] Customizing rsuite to match Figma
- [ ] Learning rsuite API
- [ ] Finding best practices

---

## WORKFLOW 1: Learn rsuite Component (Day 1-3)

**Goal:** Understand how to use rsuite Button, Form, Modal, etc

**Your Prompt:**

```
I'm building a [COMPONENT_NAME] for my React app.

Can you show me:

1. rsuite [COMPONENT_NAME] component
   - How to import it
   - Basic usage example
   - Props available
   - Events available
   
2. All variants/sizes
   - Different ways to use it
   - When to use each variant
   
3. How to customize it
   - Using appearance prop
   - Using className for Tailwind
   - Using style prop
   
4. Best practices
   - Accessibility
   - Mobile responsiveness
   - Error handling
   
5. Example code
   - Production-ready example
   - With all features
   - Fully commented

Give me code I can paste and modify.
```

**rsuite MCP Response:** (Complete examples and docs)

**Result:** You know how to use rsuite component

---

## WORKFLOW 2: Match rsuite to Figma Design (Before Building)

**Goal:** Make rsuite look exactly like Figma design

**Your Prompt:**

```
I'm building [COMPONENT_NAME] using rsuite.

Figma specs:
[PASTE FIGMA SPECS]

rsuite component:
[PASTE RSUITE CODE]

Can you:

1. Compare Figma design to rsuite defaults
   - What matches
   - What doesn't match
   
2. Show customizations needed
   - CSS classes to add
   - Style props to set
   - Props to use
   
3. Give me updated code
   - Modified rsuite code
   - Tailwind classes
   - Inline styles
   - That matches Figma exactly
   
4. Verify responsiveness
   - Does it look right on mobile with changes?
   - Does it look right on desktop?

Make the rsuite component look exactly like Figma.
```

**rsuite MCP Response:** (Customized rsuite code)

**Result:** rsuite components match Figma design

---

## WORKFLOW 3: Find rsuite Gotchas and Best Practices

**Goal:** Avoid common rsuite mistakes

**Your Prompt:**

```
I'm using rsuite [COMPONENT] in my project.

Common questions:

1. What are common gotchas with rsuite [COMPONENT]?
   - What catches people off guard?
   - What breaks easily?
   - What should I avoid?

2. Best practices
   - How should I use it?
   - How should I NOT use it?
   - What's the most maintainable way?
   
3. Accessibility
   - Is rsuite [COMPONENT] accessible?
   - What do I need to add?
   - ARIA attributes needed?
   
4. Mobile responsiveness
   - Does rsuite [COMPONENT] work on mobile?
   - What adjustments needed?
   - Common mobile issues?

5. Performance
   - Does rsuite [COMPONENT] have performance issues?
   - How many should I render?
   - Optimization tips?

Keep it practical and actionable.
```

**rsuite MCP Response:** (Practical tips and warnings)

**Result:** You avoid problems before they happen

---

## PART 4: CONTEXT7 MCP WORKFLOW

### What Context7 MCP Does
Manages conversation context, keeps track of decisions, maintains state across conversations.

### When to Use Context7 MCP
- [ ] Start of day (review decisions made so far)
- [ ] Making important architectural decisions
- [ ] Keeping track of assumptions
- [ ] Reviewing progress
- [ ] Documenting decisions

---

## WORKFLOW 1: Log Architectural Decisions (When Making Them)

**Goal:** Keep track of why you made each decision

**Your Prompt:**

```
I just made an architectural decision.

Context7, please log this:

Decision: [WHAT YOU DECIDED]

Reason: [WHY YOU CHOSE THIS]

Alternatives considered:
- [ALT 1]: pros, cons
- [ALT 2]: pros, cons
- [ALT 3]: pros, cons

Trade-offs: [WHAT YOU'RE GIVING UP]

Impact on project: [HOW IT AFFECTS OTHER PARTS]

Date: [TODAY]

Keep this for future reference.
```

**Context7 Logs:** (Keeps record)

**Result:** Later, you can reference why you made decisions

---

## WORKFLOW 2: Start of Day Review (Every Morning - 5 min)

**Goal:** Remember what you decided and why

**Your Prompt:**

```
Context7, give me a summary of:

1. Architectural decisions made so far
   - Decision
   - Why we chose it
   - How it's working

2. Assumptions we made
   - What we assumed
   - If they're still valid
   
3. Current state of project
   - What's done
   - What's in progress
   - What's blocked
   
4. Risk areas
   - What might not work
   - What we're uncertain about
   - Recovery plan

Make it quick so I can start day informed.
```

**Context7 Response:** (Quick summary)

**Result:** You know where you are without re-reading everything

---

## WORKFLOW 3: Track Decision Impact

**Goal:** When something breaks, trace back to decision that caused it

**Your Prompt:**

```
Something's not working: [ISSUE]

Context7, help me:

1. What architectural decision led to this?
2. What assumptions were we making?
3. Was there a better option?
4. Can we fix it without breaking other things?
5. What should we do instead?

Reference the decisions we logged.
```

**Context7 Response:** (Traces issue back to decisions)

**Result:** You understand root cause and can fix properly

---

## COMPLETE MCP WORKFLOW: Building a Feature from Scratch

### Example: Building the Search Feature

**DAY: Planning Phase (Morning)**

1. **Sequential-Thinking:** Break down search feature into steps
   ```
   Prompt: "Break down implementing search feature for posts"
   ```

2. **Figma:** Extract search bar specs
   ```
   Prompt: "Show me exact specs for search bar component"
   ```

3. **rsuite:** Find search component
   ```
   Prompt: "Show me rsuite Input component for search"
   ```

4. **Figma:** Compare rsuite to Figma
   ```
   Prompt: "Customize rsuite Input to match Figma search bar"
   ```

5. **Context7:** Log decision to use rsuite Input
   ```
   Prompt: "Log decision to use rsuite Input for search"
   ```

**DAY: Building Phase (Throughout Day)**

6. **Sequential-Thinking:** Before each step, understand the flow
   ```
   Prompt: "Walk me through data flow when user searches"
   ```

7. **Code Build:** Build search service, hook, component

8. **Figma:** Verify implementation matches design
   ```
   Prompt: "Compare my search implementation to Figma design"
   ```

9. **rsuite:** Handle rsuite edge cases
   ```
   Prompt: "How to make rsuite Input work on mobile?"
   ```

10. **Sequential-Thinking:** Debug any issues
    ```
    Prompt: "Search isn't debouncing properly, walk me through the bug"
    ```

**DAY: End (Evening)**

11. **Context7:** Log what you learned
    ```
    Prompt: "Log today's progress on search feature"
    ```

---

## MCP COMMAND QUICK REFERENCE

### Figma MCP
```
"Extract all design tokens"
"Show me specs for [COMPONENT]"
"Compare my code to Figma"
"Extract responsive breakpoints"
"Generate component code from design"
```

### Sequential-Thinking MCP
```
"Break down [TASK] into steps"
"Walk me through data flow for [SCENARIO]"
"Debug this issue step-by-step"
"Trace through my code execution"
"Plan today's work"
```

### rsuite MCP
```
"Show me rsuite [COMPONENT]"
"How to customize rsuite [COMPONENT]"
"Best practices for rsuite [COMPONENT]"
"rsuite [COMPONENT] on mobile"
"Compare rsuite to my Figma design"
```

### Context7 MCP
```
"Log this architectural decision"
"Give me a summary of decisions"
"What decision led to this issue?"
"Track impact of [DECISION]"
"Review assumptions we made"
```

---

## TIPS FOR MAXIMUM MCP EFFICIENCY

1. **Use MCPs early and often**
   - Don't wait until you're stuck
   - Reference them for every major decision
   - Verify design before building

2. **Chain MCPs together**
   - Get Figma specs (Figma MCP)
   - Find rsuite component (rsuite MCP)
   - Customize to match (Figma + rsuite MCPs)
   - Log decision (Context7 MCP)

3. **Save time with Figma MCP**
   - Extract tokens once, use everywhere
   - Get component specs before building
   - Verify design matches code

4. **Save time with Sequential-Thinking MCP**
   - Plan before coding
   - Understand flows before building
   - Debug faster with step-by-step analysis

5. **Use Context7 for long-term thinking**
   - Remember why you made decisions
   - Avoid re-deciding the same thing
   - Track trade-offs and impact

---

## DAY-BY-DAY MCP USAGE

### Day 0: Setup
- **Figma:** Extract all tokens
- **Figma:** Extract all component specs
- **Sequential-Thinking:** Plan all 4 days of work
- **Context7:** Log architectural decisions

### Day 1: Auth
- **Sequential-Thinking:** Plan day, break into steps
- **Figma:** Verify login/register screens match
- **rsuite:** Use rsuite Form for auth forms
- **Sequential-Thinking:** Debug any issues
- **Context7:** Log what you learned

### Day 2: Posts
- **Sequential-Thinking:** Understand data flow for posts
- **Figma:** Verify post list/detail match
- **rsuite:** Use rsuite components for post UI
- **Sequential-Thinking:** Debug complex state issues
- **Context7:** Log decisions

### Day 3: Analytics & Polish
- **Sequential-Thinking:** Plan analytics dashboard
- **Figma:** Verify dashboard matches
- **Sequential-Thinking:** Debug performance issues
- **Context7:** Review all decisions made

### Day 4: Final
- **Context7:** Review what you built
- **Sequential-Thinking:** Plan any final fixes
- **Figma:** Final verification against design

---

This playbook gives you concrete prompts and workflows for each MCP. Reference this whenever you want to use them effectively!
