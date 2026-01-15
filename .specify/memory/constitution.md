<!--
SYNC IMPACT REPORT:
Version: 0.0.0 → 1.0.0
Modified Principles: Initial creation based on existing project documentation
Added Sections:
  - All core principles (I-VII)
  - Code Quality Standards
  - Development Workflow
  - Governance
Templates Status:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - User story requirements align with testing and functional principles
  ✅ tasks-template.md - Task organization reflects test-first and independent testing principles
Follow-up TODOs: None
-->

# AIBootCamp-Session6 Todo App Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

All code MUST adhere to established quality standards:

- **DRY (Don't Repeat Yourself)**: Extract common code into shared functions, reusable components, and utility modules. No duplicate logic across the codebase.
- **KISS (Keep It Simple)**: Prefer simple, straightforward implementations over complex ones. Code must be readable at first glance.
- **Single Responsibility**: Each module, component, and function has one well-defined responsibility and one reason to change.
- **Clear Naming**: Use descriptive camelCase for variables/functions, PascalCase for components/classes, UPPER_SNAKE_CASE for constants.

**Rationale**: Quality standards prevent technical debt accumulation and ensure long-term maintainability. These principles are derived from industry best practices and enable team scalability.

### II. Test-First Development (NON-NEGOTIABLE)

Testing is mandatory and follows strict discipline:

- **Comprehensive Coverage**: Minimum 80% code coverage across all packages. Critical user workflows require 100% coverage.
- **Test Types**: Unit tests for isolated components, integration tests for component interactions and API communication.
- **Test Quality**: Tests verify behavior (not implementation), are independent, use descriptive names, and follow Arrange-Act-Assert pattern.
- **Test Organization**: Tests colocated in `__tests__/` directories with source code. Shared mocks in `__mocks__/` or `fixtures/`.

**Rationale**: Testing ensures reliability, catches regressions early, and serves as living documentation. The 80% coverage target balances thoroughness with pragmatism.

### III. Monorepo Architecture

Project follows npm workspaces monorepo structure:

- **Package Isolation**: Frontend (`packages/frontend/`) and Backend (`packages/backend/`) are independently testable and deployable.
- **Technology Stack**: React frontend, Express.js backend, Jest testing throughout.
- **Shared Dependencies**: Root-level package.json manages workspaces; individual packages maintain specific dependencies.
- **Build Commands**: `npm run start` launches both services; `npm test` runs all package tests.

**Rationale**: Monorepo enables atomic cross-package changes, shared tooling, and simplified dependency management while maintaining clear boundaries.

### IV. User-Centered Functionality

Features must deliver complete, user-validated value:

- **Functional Completeness**: All core todo operations (create, read, update status, update details, delete) with confirmation dialogs preventing accidental data loss.
- **Persistence**: Backend API ensures data durability across sessions; no client-only state for critical data.
- **Simple Scope**: Single-user application with no authentication, categories, filtering, or advanced features unless explicitly specified.
- **User Feedback**: Clear success/error messages for all operations; graceful error handling with actionable guidance.

**Rationale**: Scope clarity prevents feature creep. User-centered design ensures the application solves real problems without unnecessary complexity.

### V. Accessibility and Design Consistency

UI must be accessible and follow design system:

- **Accessibility**: WCAG AA color contrast, keyboard navigation, proper labels/aria-attributes, visible focus indicators.
- **Material Design**: Halloween-themed color palette, 8px grid spacing system, consistent typography hierarchy.
- **Theme Support**: Light and dark modes with localStorage persistence and system preference detection.
- **Responsive Layout**: Single-column 600px max-width, mobile-first with progressive enhancement for larger screens.

**Rationale**: Accessibility is not optional—it ensures usability for all users. Design consistency reduces cognitive load and improves user experience.

### VI. Error Handling and Observability

All operations must handle failures gracefully:

- **Try-Catch Blocks**: Wrap all async operations and operations that can fail.
- **Meaningful Errors**: Provide clear, actionable error messages to users (not technical stack traces).
- **Logging**: Log errors with context (what failed, why) but avoid logging sensitive data or excessive console.log in production.
- **User Feedback**: Display user-friendly error messages in UI when operations fail.

**Rationale**: Robust error handling prevents application crashes and guides users through recovery. Observability enables debugging and monitoring.

### VII. Simplicity and Pragmatism

Development approach favors practical solutions:

- **YAGNI (You Aren't Gonna Need It)**: Don't build features or abstractions until they're needed. No premature optimization.
- **Clear Over Clever**: Readable code beats clever code. Optimize only when performance issues are measured.
- **Incremental Development**: Start with working solution, refactor when patterns emerge, not before.
- **No Over-Engineering**: Use appropriate tools and patterns for the problem size. Avoid framework overkill.

**Rationale**: Simplicity reduces maintenance burden, accelerates delivery, and prevents gold-plating. This project is a bootcamp learning tool, not enterprise infrastructure.

## Code Quality Standards

### File Organization

- **Frontend Structure**: `src/components/`, `src/services/`, `src/styles/`, `src/__tests__/`
- **Backend Structure**: `src/routes/`, `src/controllers/`, `src/services/`, `src/__tests__/`
- **Naming Conventions**: Components in PascalCase (TodoCard.js), utilities in camelCase (dateFormatter.js)
- **Import Order**: External libraries → Internal modules → Styles, with blank lines between groups

### Code Style

- **Indentation**: 2 spaces for all file types (JS, JSON, CSS, Markdown)
- **Line Length**: Under 100 characters for code readability
- **No Trailing Whitespace**: Clean line endings
- **Comments**: Explain "why" not "what"; JSDoc for public functions

### Linting

- ESLint enforces style rules, catches unused variables, ensures import/export consistency
- All linting errors and warnings must be resolved before PR submission
- No console statements in production code (use logging utilities)

## Development Workflow

### Feature Implementation

1. **Understand Requirements**: Review functional requirements and UI guidelines in `docs/`
2. **Write Tests First**: Create failing tests for new behavior (TDD approach)
3. **Implement Minimally**: Write simplest code to make tests pass
4. **Refactor**: Improve code quality while keeping tests green
5. **Verify Coverage**: Ensure 80%+ coverage maintained

### Git Practices

- **Atomic Commits**: Each commit represents one logical change with clear message
- **Branch Naming**: `feature/descriptive-name` for new work
- **Pull Requests**: Required for code review before merging to main
- **Commit Messages**: Format `type: brief description` (e.g., `feat: add todo editing`)

### Code Review Checklist

Before submitting code for review:

- [ ] Code follows naming conventions
- [ ] Imports organized correctly
- [ ] No linting errors or warnings
- [ ] Code is DRY and follows single responsibility
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] Coverage meets 80% threshold
- [ ] Comments are clear and helpful
- [ ] No debug console.log statements

## Governance

This constitution supersedes all other development practices and documentation. All team members and AI assistants must verify compliance with these principles during development and code review.

**Amendment Process**:

- Amendments require documentation of rationale and impact analysis
- Breaking changes require MAJOR version bump
- New principles/sections require MINOR version bump
- Clarifications/refinements require PATCH version bump
- All amendments must include update date and migration plan if applicable

**Compliance Verification**:

- Every PR must be checked against constitution principles
- Violations require explicit justification documented in PR or plan.md "Complexity Tracking" section
- Unjustified violations block merge

**Living Document**:

- Constitution evolves with project needs
- Team feedback incorporated through amendment process
- Continuous improvement encouraged

**Version**: 1.0.0 | **Ratified**: 2026-01-15 | **Last Amended**: 2026-01-15
