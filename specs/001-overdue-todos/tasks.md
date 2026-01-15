# Tasks: Overdue Todo Items

**Feature**: Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Input**: Design documents from `/specs/001-overdue-todos/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks are included as this is a TDD-focused project per constitution requirements (80%+ coverage, test-first development).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `packages/backend/`, `packages/frontend/`
- Frontend paths: `packages/frontend/src/`
- Backend paths: `packages/backend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project is ready for feature development

- [X] T001 Verify monorepo structure and dependencies installed via `npm install`
- [X] T002 Verify existing todo functionality works via `npm test`
- [X] T003 Create feature branch `001-overdue-todos` from main

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and styling that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create dateUtils.js utility module in packages/frontend/src/utils/dateUtils.js
- [X] T005 [P] Add overdue color CSS variables to packages/frontend/src/styles/theme.css (light and dark mode)
- [X] T006 Write failing unit test for isOverdue() with no due date in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [X] T007 Write failing unit test for isOverdue() with completed todo in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [X] T008 Write failing unit test for isOverdue() due today in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [X] T009 Write failing unit test for isOverdue() due yesterday in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [X] T010 Write failing unit test for isOverdue() at midnight threshold in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [X] T011 Implement isOverdue() function with time-aware comparison logic in packages/frontend/src/utils/dateUtils.js
- [X] T012 Verify all dateUtils tests pass with 100% coverage via `npm test -- dateUtils.test.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Identification of Overdue Items (Priority: P1) 🎯 MVP

**Goal**: Users can quickly scan their todo list and immediately recognize which tasks have passed their due date without being completed through distinct visual indicators (color, icon, styling).

**Independent Test**: Create todos with various due dates (past, present, future), leave some incomplete past their due date, and verify they are visually distinguished from other todos.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T013 [P] [US1] Write failing test for overdue todo displays overdue CSS class in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T014 [P] [US1] Write failing test for overdue todo displays warning icon in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T015 [P] [US1] Write failing test for non-overdue todo does NOT display overdue class in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T016 [P] [US1] Write failing test for completed past-due todo does NOT display overdue indicator in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T017 [P] [US1] Write failing test for todo without due date does NOT display overdue indicator in packages/frontend/src/components/__tests__/TodoCard.test.js

### Implementation for User Story 1

- [X] T018 [US1] Import isOverdue utility in packages/frontend/src/components/TodoCard.js
- [X] T019 [US1] Add overdue calculation and conditional CSS class to TodoCard component in packages/frontend/src/components/TodoCard.js
- [X] T020 [US1] Add overdue warning icon (⚠️) to TodoCard when overdue in packages/frontend/src/components/TodoCard.js
- [X] T021 [US1] Add overdue styling rules (.todo-card.overdue, .overdue-icon) to packages/frontend/src/styles/theme.css
- [X] T022 [US1] Verify all TodoCard overdue tests pass via `npm test -- TodoCard.test.js`
- [X] T023 [US1] Manual test: Create todo with past due date and verify red border, icon, and styling appear
- [X] T024 [US1] Manual test: Mark overdue todo complete and verify styling disappears
- [X] T025 [US1] Manual test: Verify overdue styling in both light and dark themes

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - overdue todos are visually distinct

---

## Phase 4: User Story 2 - Real-Time Overdue Status Updates (Priority: P2)

**Goal**: Overdue status updates automatically without page refresh as time passes, especially for todos due today that become overdue at midnight.

**Independent Test**: Create a todo with today's due date, simulate time change to after midnight, and verify the visual indicator updates to show it as overdue without page refresh.

### Tests for User Story 2

- [X] T026 [P] [US2] Write failing test for overdue status updates when todo completed in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T027 [P] [US2] Write failing test for overdue status updates when due date changed in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T028 [P] [US2] Write failing test for real-time interval triggers re-render in packages/frontend/src/components/__tests__/TodoList.test.js

### Implementation for User Story 2

- [X] T029 [US2] Add currentTime state to TodoList component in packages/frontend/src/components/TodoList.js
- [X] T030 [US2] Implement setInterval to update currentTime every 60 seconds in packages/frontend/src/components/TodoList.js
- [X] T031 [US2] Add cleanup function to clear interval on unmount in packages/frontend/src/components/TodoList.js
- [X] T032 [US2] Pass currentTime as dependency to force TodoCard re-renders in packages/frontend/src/components/TodoList.js
- [X] T033 [US2] Verify all real-time update tests pass via `npm test -- TodoList.test.js`
- [X] T034 [US2] Manual test: Simulate time change with browser dev tools and verify status updates
- [X] T035 [US2] Manual test: Complete overdue todo and verify indicator immediately removed

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - overdue status updates in real-time

---

## Phase 5: User Story 3 - Overdue Count Summary (Priority: P3)

**Goal**: Users can see at a glance how many overdue tasks they have without counting manually through a displayed count.

**Independent Test**: Create multiple todos with past due dates, ensure they're incomplete, and verify a count display shows the correct number.

### Tests for User Story 3

- [X] T036 [P] [US3] Write failing test for overdue count displays correct number in packages/frontend/src/components/__tests__/TodoList.test.js
- [X] T037 [P] [US3] Write failing test for overdue count hidden when zero overdue todos in packages/frontend/src/components/__tests__/TodoList.test.js
- [X] T038 [P] [US3] Write failing test for overdue count decreases when todo completed in packages/frontend/src/components/__tests__/TodoList.test.js

### Implementation for User Story 3

- [X] T039 [US3] Import isOverdue utility in packages/frontend/src/components/TodoList.js
- [X] T040 [US3] Add useMemo to calculate overdueCount from todos array in packages/frontend/src/components/TodoList.js
- [X] T041 [US3] Add overdue summary component with count display in packages/frontend/src/components/TodoList.js
- [X] T042 [US3] Add conditional rendering to hide count when zero in packages/frontend/src/components/TodoList.js
- [X] T043 [US3] Add overdue-summary CSS styling to packages/frontend/src/styles/theme.css
- [X] T044 [US3] Verify all overdue count tests pass via `npm test -- TodoList.test.js`
- [X] T045 [US3] Manual test: Create 3 overdue todos and verify count shows "⚠️ 3 overdue items"
- [X] T046 [US3] Manual test: Complete one overdue todo and verify count updates to 2

**Checkpoint**: All user stories should now be independently functional - complete overdue feature with visual indicators, real-time updates, and count summary

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and ensure production readiness

- [X] T047 [P] Add JSDoc documentation to isOverdue() function in packages/frontend/src/utils/dateUtils.js
- [X] T048 [P] Add error handling for invalid date parsing in packages/frontend/src/utils/dateUtils.js
- [X] T049 [P] Add console.warn for invalid dates in packages/frontend/src/utils/dateUtils.js
- [X] T050 Run full test suite and verify 80%+ coverage maintained via `npm test -- --coverage`
- [X] T051 Verify no linting errors via ESLint (if configured)
- [X] T052 Test accessibility: Verify keyboard navigation works with overdue todos
- [X] T053 Test accessibility: Verify screen reader announces overdue status appropriately
- [X] T054 Test accessibility: Verify WCAG AA color contrast for overdue colors in both themes
- [X] T055 [P] Add Page Visibility API to pause interval when tab inactive in packages/frontend/src/components/TodoList.js
- [X] T056 Code review: Verify DRY, KISS, and Single Responsibility principles followed
- [X] T057 Update CHANGELOG or README with overdue feature documentation (if applicable)
- [X] T058 Run quickstart.md validation to ensure developer guide is accurate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses US1's isOverdue utility but independently testable

### Within Each User Story

1. Tests MUST be written FIRST and FAIL before implementation
2. Import utilities after they exist (T004-T012 foundational)
3. Implement component changes after tests are written
4. Verify tests pass after implementation
5. Manual testing to validate real-world behavior
6. Story complete before moving to next priority

### Parallel Opportunities

**Phase 2 (Foundational):**
- T004 (dateUtils.js file creation) + T005 (CSS variables) can run in parallel
- T006-T010 (all test writing) can run in parallel after T004 exists
- T011 (implementation) must wait for tests T006-T010

**Phase 3 (User Story 1):**
- T013-T017 (all test writing) can run in parallel
- T021 (CSS styling) can be done in parallel with T018-T020 (JS implementation)
- T023-T025 (manual tests) can be done in parallel

**Phase 4 (User Story 2):**
- T026-T028 (all test writing) can run in parallel
- T034-T035 (manual tests) can be done in parallel

**Phase 5 (User Story 3):**
- T036-T038 (all test writing) can run in parallel
- T045-T046 (manual tests) can be done in parallel

**Phase 6 (Polish):**
- T047-T049 (documentation and error handling) can run in parallel
- T052-T054 (accessibility tests) can run in parallel
- T056-T058 (final validations) can run in sequence

**Cross-Story Parallelization:**
- After Phase 2 completes, different team members can work on US1, US2, and US3 simultaneously
- Each story has isolated files and clear test boundaries

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task T013: "Write failing test for overdue todo displays overdue CSS class"
Task T014: "Write failing test for overdue todo displays warning icon"
Task T015: "Write failing test for non-overdue todo does NOT display overdue class"
Task T016: "Write failing test for completed past-due todo does NOT display overdue indicator"
Task T017: "Write failing test for todo without due date does NOT display overdue indicator"

# After tests written, implement in TodoCard.js:
Task T018: "Import isOverdue utility in TodoCard.js"
Task T019: "Add overdue calculation and conditional CSS class to TodoCard"
Task T020: "Add overdue warning icon when overdue"

# While JS implementation happening, CSS can be done in parallel:
Task T021: "Add overdue styling rules to theme.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T012) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T013-T025)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - users can now identify overdue items at a glance! 🎯

### Incremental Delivery

1. Setup + Foundational (T001-T012) → Foundation ready
2. Add User Story 1 (T013-T025) → Test independently → Deploy/Demo (MVP! Visual indicators working)
3. Add User Story 2 (T026-T035) → Test independently → Deploy/Demo (Real-time updates added)
4. Add User Story 3 (T036-T046) → Test independently → Deploy/Demo (Count summary added)
5. Polish (T047-T058) → Final production-ready state
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T012)
2. Once Foundational is done (after T012):
   - **Developer A**: User Story 1 (T013-T025) - Visual indicators
   - **Developer B**: User Story 2 (T026-T035) - Real-time updates
   - **Developer C**: User Story 3 (T036-T046) - Count summary
3. Stories complete and integrate independently
4. Team reconvenes for Polish (T047-T058)

---

## Task Count Summary

- **Total Tasks**: 58
- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 9 tasks (BLOCKING)
- **Phase 3 (User Story 1 - P1)**: 13 tasks ← MVP stops here
- **Phase 4 (User Story 2 - P2)**: 10 tasks
- **Phase 5 (User Story 3 - P3)**: 11 tasks
- **Phase 6 (Polish)**: 12 tasks

**Parallel Opportunities Identified**: 26 tasks marked [P] or can run in parallel with others

**Independent Test Criteria**:
- **US1**: Create todos with various due dates, verify visual distinction of overdue items
- **US2**: Simulate time change, verify real-time status updates without refresh
- **US3**: Create multiple overdue todos, verify accurate count display

**Suggested MVP Scope**: Complete through Phase 3 (User Story 1) = 25 tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests written FIRST per TDD constitution requirement
- 100% coverage target for isOverdue() utility (critical logic)
- 80%+ overall coverage maintained per constitution
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution compliance verified throughout (DRY, KISS, accessibility, YAGNI)

