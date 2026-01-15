# Quickstart: Overdue Todo Items Feature

**Feature**: Overdue Todo Items
**Date**: 2026-01-15
**Branch**: `001-overdue-todos`
**Prerequisites**: Node.js 16+, npm 7+

## Overview

This quickstart guide helps developers set up their environment to develop and test the overdue todo feature. The feature adds visual indicators to identify incomplete todos past their due date.

## Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Clone repository (if not already done)
git clone <repository-url>
cd AIBootCamp-Session6

# Checkout feature branch
git checkout 001-overdue-todos

# Install all dependencies
npm install

# Verify installation
npm run test
```

### 2. Start Development Environment

```bash
# Start both frontend and backend (single command)
npm run start
```

This starts:
- **Backend**: http://localhost:3030 (Express API)
- **Frontend**: http://localhost:3000 (React app)

### 3. Verify Setup

Open browser to http://localhost:3000 and verify:
- ✅ Todo list loads
- ✅ Can create new todos with due dates
- ✅ Can toggle completion status
- ✅ Can edit todos

## Project Structure for This Feature

```
packages/
├── frontend/src/
│   ├── utils/
│   │   ├── dateUtils.js           # NEW: isOverdue() utility
│   │   └── __tests__/
│   │       └── dateUtils.test.js  # NEW: overdue logic tests
│   │
│   ├── components/
│   │   ├── TodoCard.js            # MODIFY: add overdue styling
│   │   ├── TodoList.js            # MODIFY: add overdue count (P3)
│   │   └── __tests__/
│   │       ├── TodoCard.test.js   # MODIFY: add overdue tests
│   │       └── TodoList.test.js   # MODIFY: add count tests
│   │
│   └── styles/
│       └── theme.css              # MODIFY: add overdue colors
│
└── backend/src/
    └── (no changes required)
```

## Development Workflow

### Phase 1: Implement Core Overdue Logic (P1)

#### Step 1: Create Overdue Utility

**File**: `packages/frontend/src/utils/dateUtils.js`

```javascript
/**
 * Determines if a todo is overdue based on current date/time
 * @param {Object} todo - Todo object with dueDate and completed fields
 * @returns {boolean} True if incomplete and past due date at 00:00:00
 */
export function isOverdue(todo) {
  // Not overdue if no due date or already completed
  if (!todo.dueDate || todo.completed) {
    return false;
  }
  
  try {
    // Create date at midnight of the day AFTER due date
    const overdueThreshold = new Date(todo.dueDate);
    
    // Validate date
    if (isNaN(overdueThreshold.getTime())) {
      console.warn(`Invalid due date for todo ${todo.id}: ${todo.dueDate}`);
      return false;
    }
    
    overdueThreshold.setHours(24, 0, 0, 0); // Next day at 00:00:00
    
    const now = new Date();
    return now >= overdueThreshold;
  } catch (error) {
    console.error(`Error calculating overdue for todo ${todo.id}:`, error);
    return false;
  }
}
```

**Test the utility:**
```bash
npm run test:frontend -- dateUtils.test.js
```

#### Step 2: Add Overdue Styling

**File**: `packages/frontend/src/styles/theme.css`

```css
/* Add to existing theme.css */

/* Overdue styling - Light mode */
.todo-card.overdue {
  border-left: 4px solid var(--danger-color);
  background-color: var(--danger-bg);
}

.todo-card.overdue .todo-title {
  color: var(--danger-text);
}

.overdue-icon {
  color: var(--danger-color);
  margin-right: 8px;
  font-size: 16px;
}

/* Define danger colors if not already in theme */
:root {
  --danger-color: #c62828;
  --danger-bg: #ffebee;
  --danger-text: #b71c1c;
}

/* Dark mode overrides */
[data-theme="dark"] {
  --danger-color: #ef5350;
  --danger-bg: #4a2020;
  --danger-text: #ef9a9a;
}
```

#### Step 3: Update TodoCard Component

**File**: `packages/frontend/src/components/TodoCard.js`

```javascript
import { isOverdue } from '../utils/dateUtils';

function TodoCard({ todo, onUpdate, onDelete }) {
  const overdue = isOverdue(todo);
  
  return (
    <div className={`todo-card ${overdue ? 'overdue' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
        />
        
        <div className="todo-details">
          {overdue && <span className="overdue-icon">⚠️</span>}
          <span className="todo-title">{todo.title}</span>
          {todo.dueDate && (
            <span className="todo-due-date">
              Due: {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div className="todo-actions">
          <button onClick={() => onEdit(todo)}>Edit</button>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
```

**Test the component:**
```bash
npm run test:frontend -- TodoCard.test.js
```

#### Step 4: Verify in Browser

1. Create a todo with a past due date (e.g., yesterday)
2. Verify red border and warning icon appear
3. Mark todo as complete → overdue styling disappears
4. Unmark completion → overdue styling reappears

### Phase 2: Real-Time Updates (P2 - Optional)

**File**: `packages/frontend/src/App.js` or `TodoList.js`

```javascript
import { useState, useEffect } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Real-time update interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Check every 60 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // ... rest of component
}
```

**Test real-time updates:**
1. Use Jest fake timers to simulate time passage
2. Verify overdue status updates after midnight

### Phase 3: Overdue Count Summary (P3 - Optional)

**File**: `packages/frontend/src/components/TodoList.js`

```javascript
import { useMemo } from 'react';
import { isOverdue } from '../utils/dateUtils';

function TodoList() {
  const [todos, setTodos] = useState([]);
  
  // Calculate overdue count efficiently
  const overdueCount = useMemo(() => {
    return todos.filter(todo => isOverdue(todo)).length;
  }, [todos, currentTime]);
  
  return (
    <div>
      {overdueCount > 0 && (
        <div className="overdue-summary">
          ⚠️ {overdueCount} overdue {overdueCount === 1 ? 'item' : 'items'}
        </div>
      )}
      
      {todos.map(todo => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

## Testing Strategy

### Unit Tests

**File**: `packages/frontend/src/utils/__tests__/dateUtils.test.js`

```javascript
import { isOverdue } from '../dateUtils';

describe('isOverdue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-15T12:00:00'));
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('returns false for todo without due date', () => {
    const todo = { id: 1, dueDate: null, completed: 0 };
    expect(isOverdue(todo)).toBe(false);
  });
  
  test('returns false for completed todo with past due date', () => {
    const todo = { id: 1, dueDate: '2026-01-01', completed: 1 };
    expect(isOverdue(todo)).toBe(false);
  });
  
  test('returns true for incomplete todo due yesterday', () => {
    const todo = { id: 1, dueDate: '2026-01-14', completed: 0 };
    expect(isOverdue(todo)).toBe(true);
  });
  
  test('returns false for todo due today', () => {
    const todo = { id: 1, dueDate: '2026-01-15', completed: 0 };
    expect(isOverdue(todo)).toBe(false);
  });
  
  test('returns false at 23:59:59 on due date', () => {
    jest.setSystemTime(new Date('2026-01-15T23:59:59'));
    const todo = { id: 1, dueDate: '2026-01-15', completed: 0 };
    expect(isOverdue(todo)).toBe(false);
  });
  
  test('returns true at 00:00:00 day after due date', () => {
    jest.setSystemTime(new Date('2026-01-16T00:00:00'));
    const todo = { id: 1, dueDate: '2026-01-15', completed: 0 };
    expect(isOverdue(todo)).toBe(true);
  });
});
```

**Run tests:**
```bash
npm run test:frontend -- --coverage
```

### Integration Tests

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

```javascript
import { render, screen } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard - Overdue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-15T12:00:00'));
  });
  
  test('applies overdue class to card with past due date', () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue task',
      dueDate: '2026-01-10',
      completed: 0
    };
    
    const { container } = render(<TodoCard todo={overdueTodo} />);
    const card = container.querySelector('.todo-card');
    
    expect(card).toHaveClass('overdue');
  });
  
  test('displays overdue icon for overdue todo', () => {
    const overdueTodo = {
      id: 1,
      title: 'Overdue task',
      dueDate: '2026-01-10',
      completed: 0
    };
    
    render(<TodoCard todo={overdueTodo} />);
    
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
  
  test('does not apply overdue class to completed todo', () => {
    const completedTodo = {
      id: 1,
      title: 'Completed task',
      dueDate: '2026-01-10',
      completed: 1
    };
    
    const { container } = render(<TodoCard todo={completedTodo} />);
    const card = container.querySelector('.todo-card');
    
    expect(card).not.toHaveClass('overdue');
  });
});
```

### Manual Testing Checklist

- [ ] Create todo with past due date → displays overdue indicator
- [ ] Create todo with today's date → no overdue indicator
- [ ] Create todo with future date → no overdue indicator
- [ ] Create todo with no due date → no overdue indicator
- [ ] Mark overdue todo complete → overdue indicator disappears
- [ ] Unmark completed overdue todo → overdue indicator reappears
- [ ] Edit overdue todo to future date → overdue indicator disappears
- [ ] Edit future todo to past date → overdue indicator appears
- [ ] Verify light/dark mode colors look correct
- [ ] Verify accessibility (keyboard navigation, screen reader)

## Common Issues & Troubleshooting

### Issue: "isOverdue is not a function"

**Cause**: Missing import or incorrect export

**Solution**:
```javascript
// Ensure correct export in dateUtils.js
export function isOverdue(todo) { ... }

// Ensure correct import in components
import { isOverdue } from '../utils/dateUtils';
```

### Issue: Overdue styling not visible

**Cause**: CSS not imported or class not applied

**Solution**:
```javascript
// Verify theme.css is imported in App.js or index.js
import './styles/theme.css';

// Verify className is set correctly
<div className={`todo-card ${overdue ? 'overdue' : ''}`}>
```

### Issue: Tests fail with "TypeError: Cannot read property 'dueDate'"

**Cause**: Mock data missing required fields

**Solution**:
```javascript
// Ensure test todos have all required fields
const mockTodo = {
  id: 1,
  title: 'Test',
  dueDate: '2026-01-10',
  completed: 0,
  createdAt: '2026-01-01T00:00:00Z'
};
```

### Issue: Date comparison incorrect for timezone

**Cause**: Date string parsing issues

**Solution**: Always use ISO 8601 format (YYYY-MM-DD) for due dates

## Performance Tips

### Optimize Overdue Count Calculation

```javascript
// Use useMemo to avoid recalculating on every render
const overdueCount = useMemo(() => {
  return todos.filter(isOverdue).length;
}, [todos, currentTime]);
```

### Optimize Real-Time Updates

```javascript
// Use Page Visibility API to pause updates when tab inactive
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    clearInterval(intervalRef.current);
  };
}, []);
```

## Coverage Goals

- ✅ `dateUtils.js`: 100% coverage (critical logic)
- ✅ `TodoCard.js`: 85%+ coverage (overdue rendering paths)
- ✅ `TodoList.js`: 85%+ coverage (count summary if implemented)
- ✅ Overall frontend: 80%+ coverage maintained

**Check coverage:**
```bash
npm run test:frontend -- --coverage
```

## Code Review Checklist

Before submitting PR:

- [ ] All tests pass (`npm test`)
- [ ] Coverage meets 80% threshold
- [ ] No linting errors (`npm run lint` if configured)
- [ ] Manual testing checklist completed
- [ ] Code follows DRY/KISS/Single Responsibility principles
- [ ] Comments explain "why" not "what"
- [ ] Commit messages are clear and atomic
- [ ] Feature works in both light and dark mode
- [ ] Accessibility verified (keyboard navigation, WCAG AA contrast)

## Next Steps

1. **Implement P1** (Visual Indicators): Core overdue functionality
2. **Test Thoroughly**: Achieve 100% coverage for `isOverdue()`
3. **Optional P2** (Real-Time): Add interval-based updates if time permits
4. **Optional P3** (Count): Add overdue summary if time permits
5. **PR Review**: Submit for team review with all tests passing

## Resources

- [Project Overview](../../../docs/project-overview.md)
- [Coding Guidelines](../../../docs/coding-guidelines.md)
- [Testing Guidelines](../../../docs/testing-guidelines.md)
- [UI Guidelines](../../../docs/ui-guidelines.md)
- [Feature Spec](spec.md)
- [Implementation Plan](plan.md)
- [Research Notes](research.md)
- [Data Model](data-model.md)
- [API Contract](contracts/api-contract.md)

