import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

describe('TodoList Component', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      dueDate: '2025-12-25',
      completed: 0,
      createdAt: '2025-11-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      dueDate: null,
      completed: 1,
      createdAt: '2025-11-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when todos array is empty', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
  });

  it('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render correct number of todo cards', () => {
    const { container } = render(
      <TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />
    );
    
    const cards = container.querySelectorAll('.todo-card');
    expect(cards).toHaveLength(2);
  });

  it('should pass handlers to TodoCard components', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    // Verify that edit buttons exist for each todo
    expect(screen.getAllByLabelText(/Edit/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(2);
  });

  // User Story 2: Real-Time Overdue Status Updates Tests (T026-T028)
  describe('Real-Time Overdue Updates', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('T026: should update overdue status when todo completed', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const overdueTodo = {
        id: 1,
        title: 'Overdue Todo',
        dueDate: yesterdayStr,
        completed: 0
      };

      const { container, rerender } = render(
        <TodoList todos={[overdueTodo]} {...mockHandlers} isLoading={false} />
      );

      // Initially should be overdue
      let card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');

      // Complete the todo
      const completedTodo = { ...overdueTodo, completed: 1 };
      rerender(<TodoList todos={[completedTodo]} {...mockHandlers} isLoading={false} />);

      // Should no longer be overdue
      card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
    });

    it('T027: should update overdue status when due date changed', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const overdueTodo = {
        id: 1,
        title: 'Test Todo',
        dueDate: yesterdayStr,
        completed: 0
      };

      const { container, rerender } = render(
        <TodoList todos={[overdueTodo]} {...mockHandlers} isLoading={false} />
      );

      // Initially should be overdue
      let card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');

      // Change due date to tomorrow
      const updatedTodo = { ...overdueTodo, dueDate: tomorrowStr };
      rerender(<TodoList todos={[updatedTodo]} {...mockHandlers} isLoading={false} />);

      // Should no longer be overdue
      card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
    });

    it('T028: should set up interval for real-time updates', () => {
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      
      render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);

      // Verify that setInterval was called
      expect(setIntervalSpy).toHaveBeenCalled();
      
      // Get the interval call arguments
      const intervalCalls = setIntervalSpy.mock.calls;
      const lastCall = intervalCalls[intervalCalls.length - 1];
      
      // Verify interval is 60 seconds (60000 ms)
      expect(lastCall[1]).toBe(60000);

      setIntervalSpy.mockRestore();
    });
  });

  // User Story 3: Overdue Count Summary Tests (T036-T038)
  describe('Overdue Count Summary', () => {
    it('T036: should display overdue count with correct number', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const overdueTodos = [
        { id: 1, title: 'Overdue 1', dueDate: yesterdayStr, completed: 0 },
        { id: 2, title: 'Overdue 2', dueDate: yesterdayStr, completed: 0 },
        { id: 3, title: 'Overdue 3', dueDate: yesterdayStr, completed: 0 },
      ];

      render(<TodoList todos={overdueTodos} {...mockHandlers} isLoading={false} />);

      expect(screen.getByText(/3 overdue/i)).toBeInTheDocument();
    });

    it('T037: should hide overdue count when zero overdue todos', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const futureTodos = [
        { id: 1, title: 'Future 1', dueDate: tomorrowStr, completed: 0 },
        { id: 2, title: 'Future 2', dueDate: tomorrowStr, completed: 0 },
      ];

      render(<TodoList todos={futureTodos} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/overdue/i)).not.toBeInTheDocument();
    });

    it('T038: should decrease overdue count when todo completed', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const overdueTodos = [
        { id: 1, title: 'Overdue 1', dueDate: yesterdayStr, completed: 0 },
        { id: 2, title: 'Overdue 2', dueDate: yesterdayStr, completed: 0 },
      ];

      const { rerender } = render(
        <TodoList todos={overdueTodos} {...mockHandlers} isLoading={false} />
      );

      // Initially should show 2 overdue
      expect(screen.getByText(/2 overdue/i)).toBeInTheDocument();

      // Complete one todo
      const updatedTodos = [
        { id: 1, title: 'Overdue 1', dueDate: yesterdayStr, completed: 1 },
        { id: 2, title: 'Overdue 2', dueDate: yesterdayStr, completed: 0 },
      ];

      rerender(<TodoList todos={updatedTodos} {...mockHandlers} isLoading={false} />);

      // Should now show 1 overdue
      expect(screen.getByText(/1 overdue/i)).toBeInTheDocument();
    });
  });
});
