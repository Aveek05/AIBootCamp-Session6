# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-01-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add visual indicators to identify incomplete todos with past due dates. The feature implements time-aware comparison logic (overdue starts at 00:00:00 on the day after due date) with optional real-time updates and an overdue count summary. Core technical approach involves derived state calculation on both frontend and backend, conditional CSS styling for visual indicators, and optional interval-based real-time status updates.

## Technical Context

**Language/Version**: JavaScript (Node.js 16+, React 18.2.0)
**Primary Dependencies**: React, React DOM, Express.js 4.18.2, better-sqlite3 11.10.0, axios 1.6.2
**Storage**: SQLite database (better-sqlite3) with existing todos table (id, title, dueDate, completed, createdAt)
**Testing**: Jest 29.7.0 with React Testing Library (@testing-library/react 14.0.0) and Supertest 6.3.3
**Target Platform**: Web application (desktop-focused, browser-based)
**Project Type**: Web (monorepo with frontend/backend packages)
**Performance Goals**: Visual indicator display within 3 seconds of page load, status updates within 1 second of state changes
**Constraints**: Real-time updates optional (P2 priority), maintain 80%+ test coverage, WCAG AA accessibility standards
**Scale/Scope**: Single-user application, no filtering/sorting by overdue status, existing Halloween-themed UI design

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Code Quality (NON-NEGOTIABLE)
- ✅ **DRY**: Overdue calculation logic will be extracted into shared utility function used by both frontend and backend
- ✅ **KISS**: Simple date comparison logic, no complex state machines or over-engineered patterns
- ✅ **Single Responsibility**: Overdue status calculation separated from rendering logic; visual indicators handled by dedicated styling
- ✅ **Clear Naming**: `isOverdue()` utility function, `overdue-indicator` CSS class, `overdueCount` state variable

### Test-First Development (NON-NEGOTIABLE)
- ✅ **Comprehensive Coverage**: Target 80%+ coverage for new utility functions and components; 100% for overdue calculation logic
- ✅ **Test Types**: Unit tests for `isOverdue()` utility, integration tests for TodoCard with overdue styling, integration tests for real-time updates
- ✅ **Test Quality**: Tests verify behavior (dates crossing midnight, completion status changes) not implementation details
- ✅ **Test Organization**: Tests colocated in `__tests__/` directories following existing pattern

### Monorepo Architecture
- ✅ **Package Isolation**: Frontend handles visual indicators, backend provides todos with dates for client-side calculation (or optional backend calculation)
- ✅ **Technology Stack**: Maintains existing React frontend + Express.js backend + Jest testing
- ✅ **Shared Dependencies**: No new shared dependencies required; uses existing axios, React, Express
- ✅ **Build Commands**: Works with existing `npm run start` and `npm test` commands

### User-Centered Functionality
- ✅ **Functional Completeness**: P1 (visual indicators) is complete feature; P2 (real-time) and P3 (count) are optional enhancements
- ✅ **Persistence**: No backend schema changes required; overdue status derived from existing dueDate and completed fields
- ✅ **Simple Scope**: No new CRUD operations, no filtering/sorting, no authentication; strictly visual enhancement
- ✅ **User Feedback**: Visual distinction clear within 3 seconds per SC-001; immediate updates per SC-003

### Accessibility and Design Consistency
- ✅ **Accessibility**: Multiple visual cues (color + icon + styling) ensure WCAG AA compliance; keyboard navigation unchanged
- ✅ **Material Design**: Overdue indicators use existing Halloween color palette (danger red from theme); follows 8px grid spacing
- ✅ **Theme Support**: Overdue colors defined for both light/dark modes in existing theme.css
- ✅ **Responsive Layout**: No layout changes; overdue indicators fit within existing TodoCard component

### Error Handling and Observability
- ✅ **Try-Catch Blocks**: Date parsing wrapped in error handling; invalid dates gracefully handled
- ✅ **Meaningful Errors**: If date comparison fails, log error but don't break UI rendering
- ✅ **Logging**: Log date parsing errors with context but avoid excessive console output
- ✅ **User Feedback**: No user-facing errors expected; overdue is derived state, not user action

### Simplicity and Pragmatism
- ✅ **YAGNI**: No complex state management, no Redux/Context needed; simple prop passing and local state
- ✅ **Clear Over Clever**: Date comparison uses standard JavaScript Date object, no date libraries needed unless complexity emerges
- ✅ **Incremental Development**: P1 first (visual indicators), then optionally P2 (real-time), then P3 (count)
- ✅ **No Over-Engineering**: No custom date parsing libraries, no WebSocket for real-time (setInterval sufficient for P2)

**GATE STATUS**: ✅ PASSED - All constitution principles satisfied. No violations requiring justification.

**Post-Phase 1 Re-Check**: ✅ PASSED
- All design decisions documented in research.md align with constitution
- Data model uses derived state (no schema bloat)
- API contract confirms zero backend changes (YAGNI principle)
- Quickstart shows simple, testable implementation
- No new complexity introduced beyond specified requirements

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure (monorepo)
packages/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   └── todoService.js        # Existing - no changes needed
│   │   ├── app.js                     # Existing - no changes needed
│   │   └── index.js                   # Existing - no changes needed
│   └── __tests__/
│       └── app.test.js                # Update with overdue test cases
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TodoCard.js            # Update with overdue styling
    │   │   ├── TodoList.js            # Update with overdue count (P3)
    │   │   └── __tests__/
    │   │       ├── TodoCard.test.js   # Update with overdue tests
    │   │       └── TodoList.test.js   # Update with count tests
    │   ├── utils/
    │   │   ├── dateUtils.js           # NEW - isOverdue() utility
    │   │   └── __tests__/
    │   │       └── dateUtils.test.js  # NEW - overdue logic tests
    │   ├── styles/
    │   │   └── theme.css              # Update with overdue colors
    │   └── App.js                      # Possible updates for real-time (P2)
    └── public/
        └── index.html                  # Existing - no changes
```

**Structure Decision**: Uses existing web application monorepo structure (Option 2 from template). Feature requires minimal new files: one utility module for date logic and CSS updates for visual styling. No backend changes needed as overdue status is derived client-side from existing dueDate and completed fields.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
