# Data Model: Overdue Todo Items

**Feature**: Overdue Todo Items
**Date**: 2026-01-15
**Status**: Complete

## Overview

This document describes the data model for overdue todo functionality. The key design principle is that **overdue is a derived state**, not a stored field. This eliminates data consistency issues and ensures the overdue status is always accurate based on current time.

## Entities

### Todo Item (Existing - No Schema Changes)

The existing todo entity remains unchanged. Overdue status is calculated dynamically from existing fields.

**Database Schema (SQLite - better-sqlite3):**
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  dueDate TEXT,          -- ISO 8601 date string (YYYY-MM-DD) or NULL
  completed INTEGER NOT NULL DEFAULT 0,  -- 0 = incomplete, 1 = complete
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))  -- ISO 8601 timestamp
);
```

**TypeScript/JSDoc Type (Frontend/Backend):**
```javascript
/**
 * @typedef {Object} Todo
 * @property {number} id - Unique identifier
 * @property {string} title - Todo title (max 255 chars)
 * @property {string|null} dueDate - Due date in ISO format (YYYY-MM-DD) or null
 * @property {number} completed - 0 = incomplete, 1 = complete (SQLite boolean)
 * @property {string} createdAt - Creation timestamp (ISO 8601)
 */
```

**No Schema Migration Required**: Feature uses existing fields.

## Derived State: Overdue Status

Overdue is a **computed property**, not stored in the database. This ensures consistency and eliminates synchronization issues.

### Calculation Logic

**Function Signature:**
```javascript
/**
 * Determines if a todo is overdue based on current time
 * @param {Todo} todo - Todo object with dueDate and completed fields
 * @returns {boolean} True if incomplete and past due date at 00:00:00
 */
function isOverdue(todo)
```

**Business Rules:**
1. **Overdue = true** if ALL conditions met:
   - `todo.dueDate` is not null
   - `todo.completed` is 0 (incomplete)
   - Current date/time >= midnight (00:00:00) of the day AFTER `todo.dueDate`

2. **Overdue = false** if ANY condition met:
   - `todo.dueDate` is null (no due date)
   - `todo.completed` is 1 (completed)
   - Current date/time < midnight of the day after `todo.dueDate`

**Time-Aware Comparison:**
- Due date "2026-01-14" → overdue threshold is "2026-01-15T00:00:00"
- At "2026-01-15T00:00:00" → overdue = true
- At "2026-01-14T23:59:59" → overdue = false

### Implementation Location

**Frontend (Primary):**
- Location: `packages/frontend/src/utils/dateUtils.js`
- Usage: TodoCard, TodoList components call `isOverdue(todo)` on render
- Reactivity: Re-evaluated on state changes (todo updates, real-time interval)

**Backend (Optional):**
- Location: Not required for MVP
- Future: Could add `GET /todos?filter=overdue` endpoint that calculates server-side
- Reason: Current spec doesn't require filtering; client-side calculation sufficient

## Data Flow

### 1. Page Load / Todo List Render

```
Database (todos table)
  → Backend API: GET /todos
  → Frontend: receives Todo[]
  → TodoList component: renders todos
  → For each todo:
      → TodoCard receives todo prop
      → TodoCard calls isOverdue(todo)
      → Apply CSS class: todo-card.overdue
      → Render overdue icon if true
```

### 2. Todo Completion Toggle

```
User clicks checkbox
  → Frontend: optimistic UI update (toggle completed)
  → Frontend: call todoService.updateTodoStatus(id, completed)
  → Backend API: PATCH /todos/:id/status
  → Backend: update completed field in database
  → Backend: return updated todo
  → Frontend: update state with confirmed todo
  → TodoCard re-renders
  → isOverdue(todo) recalculated
  → Overdue styling removed if completed=1
```

### 3. Due Date Change

```
User edits due date
  → Frontend: call todoService.updateTodo(id, { dueDate })
  → Backend API: PATCH /todos/:id
  → Backend: update dueDate field in database
  → Backend: return updated todo
  → Frontend: update state with confirmed todo
  → TodoCard re-renders
  → isOverdue(todo) recalculated with new dueDate
  → Overdue styling updates accordingly
```

### 4. Real-Time Update (Optional P2)

```
setInterval every 60 seconds
  → Update currentTime state
  → TodoList re-renders all TodoCards
  → Each TodoCard recalculates isOverdue(todo)
  → Overdue styling updates if threshold crossed
```

## State Management

### Frontend State (React)

**TodoList Component State:**
```javascript
const [todos, setTodos] = useState([]); // Array of Todo objects
const [currentTime, setCurrentTime] = useState(new Date()); // For real-time updates
```

**TodoCard Component Props:**
```javascript
// TodoCard.js
function TodoCard({ todo, onUpdate, onDelete }) {
  const overdue = isOverdue(todo); // Derived on every render
  
  return (
    <div className={`todo-card ${overdue ? 'overdue' : ''}`}>
      {overdue && <span className="overdue-icon">⚠️</span>}
      {/* ... rest of card */}
    </div>
  );
}
```

**No Global State Needed:**
- No Redux/Context required
- Overdue status derived from props on each render
- Performance: Date comparison is O(1), trivial cost

## Validation Rules

### Existing Validation (Unchanged)

**Title:**
- Required: Must be non-empty string
- Max Length: 255 characters
- Trimmed on save

**Due Date:**
- Optional: Can be null
- Format: ISO 8601 date string (YYYY-MM-DD)
- Validation: Must parse to valid Date object
- Invalid dates: Treated as null (no due date)

**Completed:**
- Type: Integer (0 or 1)
- Default: 0 (incomplete)

### New Validation (Overdue Calculation)

**Date Parsing Safety:**
```javascript
function isOverdue(todo) {
  if (!todo.dueDate || todo.completed) {
    return false;
  }
  
  try {
    const overdueThreshold = new Date(todo.dueDate);
    
    // Check if date is valid
    if (isNaN(overdueThreshold.getTime())) {
      console.warn(`Invalid due date for todo ${todo.id}: ${todo.dueDate}`);
      return false; // Invalid date = not overdue
    }
    
    overdueThreshold.setHours(24, 0, 0, 0);
    return new Date() >= overdueThreshold;
  } catch (error) {
    console.error(`Error calculating overdue status for todo ${todo.id}:`, error);
    return false; // Error = not overdue (fail safe)
  }
}
```

## Performance Characteristics

### Calculation Cost
- **Time Complexity**: O(1) per todo
- **Space Complexity**: O(1) (no caching needed)
- **Execution Time**: <0.01ms per call
- **Scalability**: 1000 todos = <10ms total calculation time

### Caching Strategy
**Not Needed** for MVP:
- React's render optimization handles memoization
- Date comparison is fast enough without caching
- Overdue status changes infrequently (once per day per todo)

**Future Optimization** (only if performance issue observed):
```javascript
// useMemo for overdue count in TodoList
const overdueCount = useMemo(() => {
  return todos.filter(isOverdue).length;
}, [todos, currentTime]);
```

## Edge Cases

### 1. Todos Without Due Dates
- **Behavior**: `isOverdue()` returns false
- **Rationale**: Cannot be overdue if no deadline exists
- **UI**: No overdue indicator shown

### 2. Completed Todos with Past Due Dates
- **Behavior**: `isOverdue()` returns false
- **Rationale**: Completed work is no longer overdue
- **UI**: No overdue indicator shown

### 3. Invalid Date Strings
- **Behavior**: `isOverdue()` returns false, logs warning
- **Rationale**: Fail-safe approach prevents UI crashes
- **UI**: No overdue indicator, no error to user

### 4. Extremely Old Due Dates
- **Behavior**: Same overdue styling as recent past dates
- **Rationale**: Spec doesn't require severity levels
- **Future**: Could add "severely overdue" styling (out of scope)

### 5. Timezone Edge Cases
- **Behavior**: Uses browser's local timezone consistently
- **Rationale**: Single-user app, no multi-timezone coordination
- **Edge Case**: User travels across timezones → overdue status recalculates with new local time

### 6. Daylight Saving Time Transitions
- **Behavior**: Native Date API handles DST automatically
- **Rationale**: JavaScript Date accounts for DST in local timezone
- **Edge Case**: Todo due on DST transition day → correct handling by Date object

## Testing Strategy

### Unit Tests (dateUtils.test.js)

**Test Coverage:**
1. ✅ No due date → false
2. ✅ Completed with past due date → false
3. ✅ Due today → false
4. ✅ Due yesterday → true
5. ✅ Due date at 23:59:59 (still today) → false
6. ✅ 00:00:00 day after due date → true
7. ✅ Invalid date string → false
8. ✅ Null completed field → false
9. ✅ Future due date → false

**Jest Fake Timers:**
```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-01-15T12:00:00'));
});
```

### Integration Tests (TodoCard.test.js)

**Test Coverage:**
1. ✅ Overdue todo renders with overdue CSS class
2. ✅ Overdue todo renders with warning icon
3. ✅ Non-overdue todo does NOT render overdue class
4. ✅ Completing overdue todo removes overdue indicator
5. ✅ Changing due date from past to future removes indicator

## API Contract (Unchanged)

No API changes required. Existing endpoints provide all necessary data:

**GET /todos**
- Response: Array of Todo objects with dueDate and completed fields
- Frontend calculates overdue status client-side

**PATCH /todos/:id**
- Request: { title?, dueDate? }
- Response: Updated Todo object
- Frontend recalculates overdue status on response

**PATCH /todos/:id/status**
- Request: { completed }
- Response: Updated Todo object
- Frontend recalculates overdue status on response

## Future Enhancements (Out of Scope)

**Backend Filtering:**
```javascript
// Future: GET /todos?filter=overdue
// Server calculates isOverdue() and returns filtered list
```

**Severity Levels:**
```javascript
// Future: Different styling for "slightly overdue" vs "very overdue"
function getOverdueSeverity(todo) {
  const daysOverdue = calculateDaysOverdue(todo);
  if (daysOverdue > 30) return 'severe';
  if (daysOverdue > 7) return 'moderate';
  return 'mild';
}
```

**Historical Tracking:**
```javascript
// Future: Store when todo became overdue
// Requires schema change: overdueAt field
```

## Summary

- **Zero schema changes**: Uses existing todo fields
- **Derived state**: Overdue calculated on-demand, never stored
- **Simple logic**: Time-aware date comparison at midnight threshold
- **Frontend-first**: Client-side calculation sufficient for scope
- **Fail-safe**: Invalid data returns false, doesn't crash UI
- **Performance**: <10ms for 1000 todos, no optimization needed

