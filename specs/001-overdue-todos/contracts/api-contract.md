# API Contract: Overdue Todo Items Feature

**Feature**: Overdue Todo Items
**Date**: 2026-01-15
**API Version**: Unchanged (no new endpoints)
**Status**: Complete

## Overview

The overdue todo feature requires **no API changes**. All existing endpoints continue to work unchanged. Overdue status is a **derived client-side calculation** based on existing `dueDate` and `completed` fields.

This document serves as a reference for frontend developers to understand how existing API responses support the overdue feature.

## Existing Endpoints (No Changes)

### 1. GET /todos

Retrieve all todos ordered by creation date (newest first).

**Request:**
```http
GET /todos HTTP/1.1
Host: localhost:3030
```

**Response: 200 OK**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "dueDate": "2026-01-10",
    "completed": 0,
    "createdAt": "2026-01-01T10:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Review pull requests",
    "dueDate": "2026-01-20",
    "completed": 0,
    "createdAt": "2026-01-05T14:30:00.000Z"
  },
  {
    "id": 3,
    "title": "Update dependencies",
    "dueDate": "2026-01-08",
    "completed": 1,
    "createdAt": "2026-01-03T09:15:00.000Z"
  },
  {
    "id": 4,
    "title": "Fix authentication bug",
    "dueDate": null,
    "completed": 0,
    "createdAt": "2026-01-07T16:45:00.000Z"
  }
]
```

**Overdue Calculation (Client-Side):**
Assuming current date/time is `2026-01-15T12:00:00`:
- Todo #1: **Overdue** (due 2026-01-10, incomplete, past 00:00:00 on 2026-01-11)
- Todo #2: **Not overdue** (due 2026-01-20, future date)
- Todo #3: **Not overdue** (completed, regardless of past due date)
- Todo #4: **Not overdue** (no due date)

**Fields Used for Overdue:**
- `dueDate`: ISO 8601 date string (YYYY-MM-DD) or null
- `completed`: 0 = incomplete, 1 = complete

### 2. GET /todos/:id

Retrieve a single todo by ID.

**Request:**
```http
GET /todos/1 HTTP/1.1
Host: localhost:3030
```

**Response: 200 OK**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "dueDate": "2026-01-10",
  "completed": 0,
  "createdAt": "2026-01-01T10:00:00.000Z"
}
```

**Response: 404 Not Found**
```json
{
  "error": "Todo not found"
}
```

**Overdue Calculation:** Frontend calls `isOverdue(todo)` on received object.

### 3. POST /todos

Create a new todo.

**Request:**
```http
POST /todos HTTP/1.1
Host: localhost:3030
Content-Type: application/json

{
  "title": "Write overdue feature tests",
  "dueDate": "2026-01-25"
}
```

**Response: 201 Created**
```json
{
  "id": 5,
  "title": "Write overdue feature tests",
  "dueDate": "2026-01-25",
  "completed": 0,
  "createdAt": "2026-01-15T12:30:00.000Z"
}
```

**Validation Errors:**
```json
{
  "error": "Todo title is required"
}
```

```json
{
  "error": "Todo title must not exceed 255 characters"
}
```

**Overdue Impact:** New todos typically have future due dates → not overdue on creation.

### 4. PATCH /todos/:id

Update a todo's title and/or due date.

**Request:**
```http
PATCH /todos/1 HTTP/1.1
Host: localhost:3030
Content-Type: application/json

{
  "title": "Complete project documentation (updated)",
  "dueDate": "2026-01-30"
}
```

**Response: 200 OK**
```json
{
  "id": 1,
  "title": "Complete project documentation (updated)",
  "dueDate": "2026-01-30",
  "completed": 0,
  "createdAt": "2026-01-01T10:00:00.000Z"
}
```

**Overdue Impact:**
- **Before**: dueDate = 2026-01-10 → overdue
- **After**: dueDate = 2026-01-30 → not overdue
- Frontend recalculates `isOverdue(todo)` on response

**Partial Updates Allowed:**
```http
PATCH /todos/1 HTTP/1.1
Content-Type: application/json

{
  "dueDate": "2026-02-01"
}
```
Only `dueDate` updated; `title` unchanged.

### 5. PATCH /todos/:id/status

Toggle a todo's completion status.

**Request:**
```http
PATCH /todos/1/status HTTP/1.1
Host: localhost:3030
Content-Type: application/json

{
  "completed": 1
}
```

**Response: 200 OK**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "dueDate": "2026-01-10",
  "completed": 1,
  "createdAt": "2026-01-01T10:00:00.000Z"
}
```

**Overdue Impact:**
- **Before**: completed = 0, dueDate = 2026-01-10 → overdue
- **After**: completed = 1 → **not overdue** (completed todos never overdue)
- Frontend recalculates `isOverdue(todo)` on response

### 6. DELETE /todos/:id

Delete a todo.

**Request:**
```http
DELETE /todos/1 HTTP/1.1
Host: localhost:3030
```

**Response: 204 No Content**
(Empty response body)

**Response: 404 Not Found**
```json
{
  "error": "Todo not found"
}
```

**Overdue Impact:** Todo removed from list → overdue count decreases if was overdue.

## Client-Side Overdue Calculation

### Function Contract

**Location:** `packages/frontend/src/utils/dateUtils.js`

**Function Signature:**
```javascript
/**
 * Determines if a todo is overdue based on current date/time
 * 
 * @param {Object} todo - Todo object from API
 * @param {number} todo.id - Todo ID
 * @param {string} todo.title - Todo title
 * @param {string|null} todo.dueDate - Due date in ISO 8601 format (YYYY-MM-DD) or null
 * @param {number} todo.completed - 0 = incomplete, 1 = complete
 * @param {string} todo.createdAt - Creation timestamp
 * 
 * @returns {boolean} True if todo is overdue, false otherwise
 * 
 * @example
 * // Overdue: incomplete, past due date
 * isOverdue({ dueDate: '2026-01-10', completed: 0 }) // true (if today > 2026-01-10)
 * 
 * @example
 * // Not overdue: completed
 * isOverdue({ dueDate: '2026-01-10', completed: 1 }) // false
 * 
 * @example
 * // Not overdue: no due date
 * isOverdue({ dueDate: null, completed: 0 }) // false
 * 
 * @example
 * // Not overdue: future date
 * isOverdue({ dueDate: '2026-12-31', completed: 0 }) // false
 */
export function isOverdue(todo) {
  // Implementation in dateUtils.js
}
```

### Logic Rules

1. **Returns `false` if:**
   - `todo.dueDate` is `null`
   - `todo.completed` is `1`
   - Current date/time < midnight of day after `todo.dueDate`
   - Date parsing fails (invalid date string)

2. **Returns `true` if:**
   - `todo.completed` is `0` (incomplete)
   - `todo.dueDate` is valid date string
   - Current date/time >= midnight (00:00:00) of day after `todo.dueDate`

### Time-Aware Threshold

```
Due Date: 2026-01-14
Overdue Threshold: 2026-01-15 00:00:00

Timeline:
2026-01-14 23:59:59 → NOT overdue (still within due date)
2026-01-15 00:00:00 → OVERDUE (passed midnight)
2026-01-15 00:00:01 → OVERDUE
```

## Data Flow Examples

### Example 1: Initial Page Load

```
1. Frontend → GET /todos
2. Backend → [todo1, todo2, todo3]
3. Frontend → For each todo: calculate isOverdue(todo)
4. Frontend → Render TodoCard with overdue styling if applicable
```

### Example 2: Completing Overdue Todo

```
1. User clicks checkbox on overdue todo
2. Frontend → PATCH /todos/1/status { completed: 1 }
3. Backend → { id: 1, completed: 1, dueDate: "2026-01-10", ... }
4. Frontend → isOverdue(todo) returns false (completed)
5. Frontend → Re-render TodoCard without overdue styling
```

### Example 3: Changing Due Date

```
1. User edits due date from 2026-01-10 to 2026-02-01
2. Frontend → PATCH /todos/1 { dueDate: "2026-02-01" }
3. Backend → { id: 1, dueDate: "2026-02-01", completed: 0, ... }
4. Frontend → isOverdue(todo) returns false (future date)
5. Frontend → Re-render TodoCard without overdue styling
```

### Example 4: Real-Time Midnight Transition (P2)

```
1. User viewing todo list at 23:59:00 on 2026-01-15
2. Todo has dueDate: "2026-01-15"
3. isOverdue(todo) returns false (still within due date)
4. setInterval fires at 00:00:00 on 2026-01-16
5. Frontend → Update currentTime state
6. TodoList re-renders all TodoCards
7. isOverdue(todo) returns true (passed midnight)
8. Frontend → Apply overdue styling
```

## Error Handling

### Invalid Date Formats

**Scenario:** Backend returns malformed date string

**API Response:**
```json
{
  "id": 1,
  "dueDate": "invalid-date",
  "completed": 0
}
```

**Frontend Behavior:**
```javascript
isOverdue(todo) // returns false
console.warn('Invalid due date for todo 1: invalid-date')
```

**UI Impact:** Todo rendered without overdue indicator (fail-safe).

### Missing Fields

**Scenario:** Backend response missing expected fields

**API Response:**
```json
{
  "id": 1,
  "title": "Test"
  // dueDate missing, completed missing
}
```

**Frontend Behavior:**
```javascript
isOverdue(todo) // returns false
// No error thrown, graceful degradation
```

### Network Errors

**Scenario:** API request fails

**Frontend Behavior:**
- Display error message to user
- Retry logic (if implemented)
- Stale todos remain in UI with last known overdue status

## Performance Considerations

### Calculation Frequency

**On Page Load:**
- Calculate once per todo: O(n) where n = number of todos
- 100 todos = 100 calls to `isOverdue()` = <10ms

**On State Change:**
- Recalculate for updated todo only: O(1)
- React optimizations prevent unnecessary recalculations

**On Real-Time Update (P2):**
- Recalculate all todos every 60 seconds: O(n)
- 100 todos every minute = 100 calls = <10ms every 60s = negligible

### No API Overhead

- **Zero additional API calls** for overdue feature
- No backend processing required
- Client-side calculation = instant, no latency

## Testing Contracts

### Mock API Responses

**Test Fixture: Overdue Todo**
```javascript
export const overdueTodo = {
  id: 1,
  title: "Overdue task",
  dueDate: "2026-01-01", // Past date
  completed: 0,
  createdAt: "2025-12-01T00:00:00.000Z"
};
```

**Test Fixture: Completed Past Due Todo**
```javascript
export const completedPastDueTodo = {
  id: 2,
  title: "Completed past due",
  dueDate: "2026-01-01",
  completed: 1, // Completed = not overdue
  createdAt: "2025-12-01T00:00:00.000Z"
};
```

**Test Fixture: Future Due Todo**
```javascript
export const futureTodo = {
  id: 3,
  title: "Future task",
  dueDate: "2026-12-31",
  completed: 0,
  createdAt: "2026-01-01T00:00:00.000Z"
};
```

**Test Fixture: No Due Date Todo**
```javascript
export const noDueDateTodo = {
  id: 4,
  title: "No deadline",
  dueDate: null,
  completed: 0,
  createdAt: "2026-01-01T00:00:00.000Z"
};
```

### Integration Test Example

```javascript
import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import TodoList from '../TodoList';

const server = setupServer(
  rest.get('/todos', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, title: "Overdue", dueDate: "2026-01-01", completed: 0 },
      { id: 2, title: "Not overdue", dueDate: "2026-12-31", completed: 0 }
    ]));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

test('displays overdue indicator for past due incomplete todos', async () => {
  jest.setSystemTime(new Date('2026-01-15T12:00:00'));
  
  render(<TodoList />);
  
  const overdueTodo = await screen.findByText('Overdue');
  expect(overdueTodo.closest('.todo-card')).toHaveClass('overdue');
  
  const notOverdueTodo = await screen.findByText('Not overdue');
  expect(notOverdueTodo.closest('.todo-card')).not.toHaveClass('overdue');
});
```

## Future API Extensions (Out of Scope)

### Optional: Server-Side Overdue Filtering

**Not Required for MVP** - Client-side calculation sufficient for current scale.

**Future Enhancement:**
```http
GET /todos?filter=overdue HTTP/1.1
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Overdue task",
    "dueDate": "2026-01-10",
    "completed": 0,
    "overdue": true  // Server-calculated field
  }
]
```

**Rationale for Deferring:**
- No performance issue with client-side calculation
- Spec doesn't require filtering by overdue status
- YAGNI principle: Add when needed

## Summary

- **No API changes required**: Existing endpoints provide all necessary data
- **Client-side calculation**: `isOverdue(todo)` derives status from `dueDate` and `completed`
- **Zero API overhead**: No additional requests, instant calculation
- **Backward compatible**: Existing API consumers unaffected
- **Fail-safe**: Invalid data handled gracefully, no UI crashes

