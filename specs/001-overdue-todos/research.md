# Research: Overdue Todo Items

**Feature**: Overdue Todo Items
**Date**: 2026-01-15
**Status**: Complete

## Research Summary

This document captures research findings for implementing overdue todo indicators. All technical unknowns from the plan's Technical Context have been resolved through analysis of existing codebase, JavaScript date handling best practices, and CSS styling patterns.

## 1. Date Comparison Implementation

### Decision
Use JavaScript's native Date object for time-aware comparison without external libraries.

### Rationale
- Native Date API provides millisecond precision needed for midnight (00:00:00) comparison
- No additional dependencies required (YAGNI principle)
- Browser support is universal for target platforms
- Simple comparison: `new Date() >= new Date(dueDate).setHours(24, 0, 0, 0)`

### Implementation Pattern
```javascript
// utils/dateUtils.js
export function isOverdue(todo) {
  // Not overdue if no due date or already completed
  if (!todo.dueDate || todo.completed) {
    return false;
  }
  
  // Create date at midnight of the day AFTER due date
  const overdueThreshold = new Date(todo.dueDate);
  overdueThreshold.setHours(24, 0, 0, 0); // Next day at 00:00:00
  
  const now = new Date();
  return now >= overdueThreshold;
}
```

### Alternatives Considered
- **date-fns library**: Rejected - adds 67KB dependency for simple comparison
- **moment.js**: Rejected - deprecated and heavy (288KB)
- **Date-only comparison**: Rejected - spec clarification requires time-aware comparison at exactly 00:00:00

### Edge Cases Handled
- Invalid date strings: Return false (not overdue if date unparseable)
- Timezone differences: Uses local timezone consistently (browser's Date honors user timezone)
- Leap years/DST: Native Date handles automatically

## 2. Visual Indicator Design

### Decision
Combination approach: Color + Icon + Text styling (Option C from spec clarifications)

### Rationale
- **Accessibility**: Meets WCAG AA by not relying on color alone
- **Colorblind Users**: Icon provides non-color distinction
- **Clarity**: Multiple cues reduce ambiguity
- **Material Design**: Aligns with existing design system's redundant signaling

### Implementation
```css
/* styles/theme.css additions */
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
}

/* Light mode */
:root {
  --danger-color: #c62828;
  --danger-bg: #ffebee;
  --danger-text: #b71c1c;
}

/* Dark mode */
[data-theme="dark"] {
  --danger-color: #ef5350;
  --danger-bg: #4a2020;
  --danger-text: #ef9a9a;
}
```

### Visual Treatment
- **Color**: Red border and tinted background (danger color from Halloween theme)
- **Icon**: ⚠️ warning icon or 🕐 clock icon before title
- **Text**: Danger color for title text

### Alternatives Considered
- **Color only**: Rejected - fails WCAG accessibility for colorblind users
- **Icon only**: Rejected - may be too subtle for quick scanning
- **Text label "OVERDUE"**: Considered for P3 count summary, not individual items (visual noise)

## 3. Real-Time Update Strategy (P2 - Optional)

### Decision
Client-side interval polling with smart scheduling

### Rationale
- Simplest implementation (no WebSocket infrastructure)
- Sufficient for use case (midnight transitions rare during active sessions)
- Low performance impact with smart interval (check every minute, not every second)
- Aligns with YAGNI and pragmatism principles

### Implementation Pattern
```javascript
// App.js or TodoList.js
useEffect(() => {
  // Only set interval if todos exist and feature enabled
  const interval = setInterval(() => {
    // Trigger re-render by updating a timestamp state
    setCurrentTime(new Date());
  }, 60000); // Check every 60 seconds
  
  return () => clearInterval(interval);
}, []);
```

### Smart Scheduling Enhancement
- Check every 60 seconds during business hours (8am-11pm)
- Check every 5 minutes overnight (11pm-8am) when user less likely active
- Clear interval when browser tab inactive (Page Visibility API)

### Alternatives Considered
- **WebSocket**: Rejected - massive over-engineering for midnight transitions
- **Server-sent events**: Rejected - adds complexity, no benefit for client-side derived state
- **No real-time**: Acceptable fallback if P2 deprioritized (page refresh sufficient)

## 4. Test Strategy

### Decision
Layered testing: Unit → Integration → Manual edge cases

### Test Coverage Plan

#### Unit Tests (utils/dateUtils.test.js)
```javascript
describe('isOverdue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  test('returns false for todo without due date', () => {
    expect(isOverdue({ dueDate: null, completed: false })).toBe(false);
  });
  
  test('returns false for completed todo with past due date', () => {
    const pastDate = '2026-01-01';
    expect(isOverdue({ dueDate: pastDate, completed: true })).toBe(false);
  });
  
  test('returns false for todo due today', () => {
    jest.setSystemTime(new Date('2026-01-15T14:30:00'));
    const todayDate = '2026-01-15';
    expect(isOverdue({ dueDate: todayDate, completed: false })).toBe(false);
  });
  
  test('returns true for incomplete todo due yesterday', () => {
    jest.setSystemTime(new Date('2026-01-15T00:00:01'));
    const yesterdayDate = '2026-01-14';
    expect(isOverdue({ dueDate: yesterdayDate, completed: false })).toBe(true);
  });
  
  test('returns false at 23:59:59 on due date', () => {
    jest.setSystemTime(new Date('2026-01-15T23:59:59'));
    const todayDate = '2026-01-15';
    expect(isOverdue({ dueDate: todayDate, completed: false })).toBe(false);
  });
  
  test('returns true at 00:00:00 day after due date', () => {
    jest.setSystemTime(new Date('2026-01-16T00:00:00'));
    const yesterdayDate = '2026-01-15';
    expect(isOverdue({ dueDate: yesterdayDate, completed: false })).toBe(true);
  });
});
```

#### Integration Tests (TodoCard.test.js)
- Verify overdue CSS class applied when `isOverdue()` returns true
- Verify overdue icon rendered for overdue todos
- Verify overdue styling removed when todo completed
- Verify overdue styling removed when due date changed to future

#### Manual Edge Cases
- System clock changes during session
- Timezone edge cases (DST transitions)
- Extremely old due dates (years in past)
- Invalid date formats in database

### Coverage Target
- 100% coverage for `isOverdue()` utility (critical logic)
- 85%+ coverage for TodoCard overdue rendering
- 80%+ overall package coverage maintained

## 5. Performance Considerations

### Decision
Client-side calculation with memoization for list views

### Rationale
- **Minimal CPU**: Date comparison is O(1), trivial cost per todo
- **No Network**: Derived state from existing data, no API calls
- **Scalability**: Even 1000 todos = 1000 simple comparisons = <1ms
- **Caching**: React re-render optimization handles memoization

### Optimization Strategy
```javascript
// TodoList.js - useMemo for overdue count
const overdueCount = useMemo(() => {
  return todos.filter(todo => isOverdue(todo)).length;
}, [todos, currentTime]); // Recalculate only when todos or time changes
```

### Performance Benchmarks (Expected)
- `isOverdue()` execution: <0.01ms per call
- 100 todos overdue check: <1ms total
- Page load impact: <5ms for typical todo list
- Real-time update impact: 60-second interval, negligible CPU

### Alternatives Considered
- **Backend calculation**: Rejected - requires API change, adds latency, violates derived state principle
- **IndexedDB caching**: Rejected - premature optimization, no performance problem to solve
- **Web Worker**: Rejected - massive over-engineering for simple date comparison

## 6. CSS Integration with Halloween Theme

### Decision
Extend existing theme.css with overdue color variables

### Rationale
- Existing theme.css uses CSS variables for light/dark mode
- Danger colors already defined in UI guidelines
- Consistent with Material Design elevation and color usage

### Color Palette Integration
**Light Mode:**
- Background: `#ffebee` (light red tint)
- Border: `#c62828` (danger red from guidelines)
- Text: `#b71c1c` (dark red for contrast)

**Dark Mode:**
- Background: `#4a2020` (dark red tint)
- Border: `#ef5350` (light red from guidelines)
- Text: `#ef9a9a` (light red for contrast)

### Halloween Theme Compatibility
- Red/orange color scheme complements existing orange primary
- Warning icons (⚠️) fit spooky theme
- No conflicts with existing purple accent colors

## 7. Backward Compatibility

### Decision
Zero-impact on existing functionality

### Rationale
- No database schema changes
- No API endpoint changes
- No breaking changes to TodoCard props
- Purely additive CSS and utility functions

### Migration Plan
**Not Needed** - Feature is purely additive:
- Existing todos work unchanged
- `isOverdue()` returns false for todos without due dates
- CSS classes don't break existing styling
- Tests expanded, not replaced

## Open Questions Resolution

All open questions from spec have been resolved:

1. ✅ **Midnight edge case**: Clarified as time-aware comparison at 00:00:00
2. ✅ **Visual indicator type**: Combination of color + icon + styling
3. ✅ **Real-time mechanism**: Client-side interval polling (optional P2)
4. ✅ **Old due dates**: Same visual treatment, no special handling needed
5. ✅ **Invalid system clock**: Uses browser's Date, user's timezone - best effort

## Next Steps

Proceed to Phase 1:
1. Generate data-model.md (overdue as derived field)
2. Generate contracts/ (API unchanged, document derived state)
3. Generate quickstart.md (developer setup for testing overdue)
4. Update Copilot context with new utilities and patterns

