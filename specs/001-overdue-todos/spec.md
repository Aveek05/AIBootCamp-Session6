# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: January 15, 2026  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Items (Priority: P1)

Users need to quickly scan their todo list and immediately recognize which tasks have passed their due date without being completed. The visual distinction helps users prioritize their work and address time-sensitive tasks first.

**Why this priority**: This is the core value of the feature - enabling users to instantly identify overdue items without manual date checking. Without this, users waste time comparing dates and may miss critical deadlines.

**Independent Test**: Can be fully tested by creating todos with various due dates (past, present, future), leaving some incomplete past their due date, and verifying they are visually distinguished from other todos. Delivers immediate value by making overdue items obvious at a glance.

**Acceptance Scenarios**:

1. **Given** I have a todo with a due date in the past and it is not completed, **When** I view my todo list, **Then** the overdue todo is visually distinguished from non-overdue todos (e.g., different color, icon, or styling)
2. **Given** I have a todo with a due date of today and it is not completed, **When** I view my todo list, **Then** the todo is NOT marked as overdue (today's date is not past due)
3. **Given** I have a todo with a due date in the future, **When** I view my todo list, **Then** the todo is NOT marked as overdue
4. **Given** I have a todo with a due date in the past but it is marked as completed, **When** I view my todo list, **Then** the todo is NOT marked as overdue (completed items are not overdue)
5. **Given** I have a todo without a due date, **When** I view my todo list, **Then** the todo is NOT marked as overdue (no due date means cannot be overdue)

---

### User Story 2 - Real-Time Overdue Status Updates (Priority: P2)

As time passes, todos that were not overdue can become overdue. Users expect the visual indicators to update automatically without requiring a page refresh, especially for todos due today that become overdue at midnight.

**Why this priority**: Enhances user experience by keeping information current, but users can still identify overdue items with a manual refresh if needed. This is important but not critical for basic functionality.

**Independent Test**: Can be tested by creating a todo with today's due date, waiting until after midnight (or simulating time change), and verifying the visual indicator updates to show it as overdue. Delivers value by ensuring users always see accurate status.

**Acceptance Scenarios**:

1. **Given** I have been viewing my todo list for an extended period, **When** the current date/time crosses midnight and a todo's due date becomes past, **Then** the todo automatically updates to show overdue status without page refresh
2. **Given** I complete an overdue todo, **When** I mark it as completed, **Then** the overdue visual indicator is immediately removed
3. **Given** I change a todo's due date from past to future, **When** I save the change, **Then** the overdue visual indicator is immediately removed

---

### User Story 3 - Overdue Count Summary (Priority: P3)

Users want to see at a glance how many overdue tasks they have without counting manually. This helps them understand their workload and prioritize their time.

**Why this priority**: Nice-to-have feature that improves user awareness but is not essential for identifying individual overdue items. Users can count visually if needed.

**Independent Test**: Can be tested by creating multiple todos with past due dates, ensuring they're incomplete, and verifying a count display shows the correct number. Delivers value by providing quick workload assessment.

**Acceptance Scenarios**:

1. **Given** I have 3 overdue todos, **When** I view my todo list, **Then** I see a count or summary showing "3 overdue items" (or similar indicator)
2. **Given** I have no overdue todos, **When** I view my todo list, **Then** the overdue count shows 0 or is hidden
3. **Given** I complete an overdue todo, **When** the todo is marked complete, **Then** the overdue count decreases by 1

---

### Edge Cases

- What happens when a todo's due date is exactly at midnight (00:00)? Should it be considered overdue at 00:01 on that date or the next day?
- How does the system handle todos with due dates far in the past (e.g., years ago)? Should there be different visual treatment for extremely overdue items?
- What happens when the user's system clock is incorrect or timezone is misconfigured?
- How does the system handle todos that transition from today to overdue while the user is actively editing them?
- What happens if a todo's due date is changed from overdue to future while viewing the list?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST compare each incomplete todo's due date against the current date to determine if it is overdue
- **FR-002**: System MUST consider a todo overdue only when the due date is strictly in the past (not including today's date)
- **FR-003**: System MUST NOT mark completed todos as overdue, regardless of their due date
- **FR-004**: System MUST NOT mark todos without a due date as overdue
- **FR-005**: System MUST apply a distinct visual indicator to overdue todos that differentiates them from non-overdue todos
- **FR-006**: System MUST update the overdue status of todos when their completion status changes (completed ↔ incomplete)
- **FR-007**: System MUST update the overdue status of todos when their due date is modified
- **FR-008**: System MUST display the overdue indicator consistently across all views where todos are shown
- **FR-009**: System SHOULD update overdue status in real-time as the current date changes (optional but recommended)
- **FR-010**: System MAY display a count or summary of total overdue todos (optional enhancement)

### Key Entities

- **Todo Item**: Existing entity with attributes including title, due date (optional), completion status, and creation date. Overdue status is derived from these attributes rather than stored as a separate field.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue todos within 3 seconds of viewing their todo list without reading individual due dates
- **SC-002**: 100% of overdue todos (incomplete items with past due dates) display the visual indicator correctly
- **SC-003**: Overdue status updates immediately (within 1 second) when a todo's completion status or due date is changed
- **SC-004**: Users can distinguish between overdue, due today, and future todos at a glance based on visual cues alone
- **SC-005**: Zero false positives (completed todos or todos without due dates are never marked as overdue)
- **SC-006**: User confusion about task priorities decreases as indicated by reduced time spent checking individual due dates

## Scope & Boundaries

### In Scope

- Visual indicators (color, icon, styling) to distinguish overdue todos
- Logic to determine if a todo is overdue based on due date, completion status, and current date
- Real-time or on-change updates to overdue status
- Consistent display of overdue indicators across all todo views

### Out of Scope

- Notifications or reminders about overdue todos
- Automatic sorting or filtering by overdue status
- Historical tracking of how long items have been overdue
- Overdue-specific actions (e.g., bulk operations on overdue items)
- Priority levels or severity indicators based on how overdue an item is
- Email or push notifications when items become overdue

## Assumptions

- The current date/time is available from the system or browser
- Due dates are stored in a standard date format that can be compared
- The existing todo list view supports custom styling or visual indicators
- Users understand that "overdue" means the due date has passed and the task is incomplete
- The application uses the user's local timezone for date comparisons
- Visual distinction through color, icons, or text styling is sufficient (no audio or haptic feedback needed)
- The Halloween-themed UI design can accommodate overdue indicators without conflicting with existing color schemes

## Dependencies

- Existing todo data model with due date and completion status fields
- Current date/time functionality from browser or system
- UI framework/styling system supports dynamic visual indicators
- Todo list rendering logic can be extended to apply conditional styling

## Open Questions

None - All aspects of the feature are sufficiently clear to proceed with planning.
