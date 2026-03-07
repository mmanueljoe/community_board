# AGENTS.md

## Purpose
This file defines mandatory engineering rules for agents working in this repository.
It is optimized for production-grade frontend delivery with minimal technical debt.

## Repo Context
- Monorepo root contains multiple teams.
- Frontend app lives in `frontend/`.
- All frontend commands must run from `frontend/` unless stated otherwise.

## Non-Negotiable Standards
- Use TypeScript-first patterns for active frontend code.
- Keep `strict` TypeScript discipline; do not introduce `any` unless explicitly justified.
- Do not use class components.
- Do not call backend APIs directly from page/presentational components.
- Do not introduce dead code, placeholder TODOs, or speculative abstractions.
- Prefer existing local project patterns over inventing new ones.

## Modern Frontend Stack Policy
- Build with Vite + React + TypeScript.
- Use React Router for routes and route guards.
- Use service layer and typed contracts for API access.
- Use Vitest + Testing Library for frontend tests.
- Keep API side effects in services/hooks, not in leaf UI components.
- Implement loading, empty, and error states for every async user flow.

## Feature Delivery Model (Vertical Slices)
- Build one complete slice at a time: route/page, UI, state, service integration, validation, tests.
- Do not build all UI first and wire data later.
- Do not build all services first without user-facing integration.
- Each slice must be shippable and testable before moving to the next.

## Architecture Guardrails
- Keep logic layered:
- `UI`: rendering and user interaction only.
- `Application`: hooks/feature orchestration.
- `Infrastructure`: API clients and transport details.
- Keep state ownership clear:
- Server state from service/query layer.
- UI state local to component when possible.
- Shared state only when multiple routes/features need it.

## Testing Policy
- Add tests with each slice, not at the end.
- Minimum per slice:
- One behavior test for UI flow.
- One integration/unit test for service or hook logic.
- Keep tests deterministic and independent.
- Mock network in tests (MSW or equivalent test doubles).

## Verification Gates (Before Finishing Any Task)
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test:run`
- `pnpm build`
- If a command fails, report it clearly with the failure reason and impacted scope.

## Husky and Git Workflow
- Pre-commit should run from repo root and execute frontend checks via `cd frontend`.
- Keep commits small and vertical (single feature slice or focused fix).
- Use conventional commit style: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`.

## UX and Accessibility Baseline
- Match Figma as source of truth for visual and layout behavior.
- Respect responsive design across mobile, tablet, desktop.
- Ensure keyboard accessibility for interactive elements.
- Ensure form labels, validation feedback, and readable error messaging.

## Performance Baseline
- Avoid unnecessary re-renders.
- Prefer route-level code splitting where appropriate.
- Avoid large dependency additions without clear value.
- Keep network calls minimal and deduplicated by design.

## Agent Operating Rules
- Before coding, inspect relevant local files and configs.
- State assumptions explicitly when requirements are ambiguous.
- If blocked, report the blocker and propose the lowest-risk fallback.
- Do not perform destructive git/file operations unless explicitly requested.
- Do not silently change architecture direction mid-task.

## Assignment Template for Agent Tasks
Use this structure when asking an agent to implement work:
- Goal: user outcome and business intent.
- Scope: what is included and excluded.
- Constraints: stack, banned patterns, compatibility requirements.
- Context: files/folders to inspect first.
- Acceptance Criteria: functional and non-functional checks.
- Verification: exact commands to run.
- Deliverable Format: patch summary, test evidence, known risks.

## Definition of Done
- Feature meets acceptance criteria.
- Tests for the new behavior exist and pass.
- Lint/typecheck/build pass.
- No regression in existing behavior.
- Code is understandable, maintainable, and consistent with this file.

