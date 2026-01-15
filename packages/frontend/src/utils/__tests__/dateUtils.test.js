import { isOverdue } from '../dateUtils';

describe('isOverdue', () => {
  describe('T006: should return false for todo with no due date', () => {
    test('should not be overdue when dueDate is null', () => {
      const todo = {
        id: 1,
        title: 'Test todo',
        dueDate: null,
        completed: 0
      };
      expect(isOverdue(todo)).toBe(false);
    });

    test('should not be overdue when dueDate is undefined', () => {
      const todo = {
        id: 1,
        title: 'Test todo',
        completed: 0
      };
      expect(isOverdue(todo)).toBe(false);
    });
  });

  describe('T007: should return false for completed todo', () => {
    test('should not be overdue when completed (1) even with past due date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const todo = {
        id: 1,
        title: 'Test todo',
        dueDate: yesterdayStr,
        completed: 1
      };
      expect(isOverdue(todo)).toBe(false);
    });

    test('should not be overdue when completed (true) even with past due date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const todo = {
        id: 1,
        title: 'Test todo',
        dueDate: yesterdayStr,
        completed: true
      };
      expect(isOverdue(todo)).toBe(false);
    });
  });

  describe('T008: should return false for todo due today', () => {
    test('should not be overdue when due date is today', () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const todo = {
        id: 1,
        title: 'Test todo',
        dueDate: todayStr,
        completed: 0
      };
      expect(isOverdue(todo)).toBe(false);
    });
  });

  describe('T009: should return true for todo due yesterday', () => {
    test('should be overdue when due date was yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const todo = {
        id: 1,
        title: 'Test todo',
        dueDate: yesterdayStr,
        completed: 0
      };
      expect(isOverdue(todo)).toBe(true);
    });

    test('should be overdue when due date was multiple days ago', () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];

      const todo = {
        id: 1,
        title: 'Test todo',
        dueDate: weekAgoStr,
        completed: 0
      };
      expect(isOverdue(todo)).toBe(true);
    });
  });

  describe('T010: should handle midnight threshold correctly', () => {
    test('should not be overdue at 23:59:59 on due date', () => {
      // Test with due date as today - should not be overdue
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const todo = {
        id: 1,
        title: 'Test todo',
        dueDate: todayStr,
        completed: 0
      };

      expect(isOverdue(todo)).toBe(false);
    });

    test('should be overdue at 00:00:00 the day after due date', () => {
      // Test with due date as yesterday - should be overdue
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const todo = {
        id: 1,
        title: 'Test todo',
        dueDate: yesterdayStr,
        completed: 0
      };

      expect(isOverdue(todo)).toBe(true);
    });
  });

  describe('Error handling', () => {
    test('should return false and not throw for invalid date format', () => {
      const todo = {
        id: 1,
        title: 'Test todo',
        dueDate: 'not-a-valid-date-string',
        completed: 0
      };

      // Should not throw and should return false
      expect(() => isOverdue(todo)).not.toThrow();
      expect(isOverdue(todo)).toBe(false);
    });
  });
});
