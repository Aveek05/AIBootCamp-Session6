import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  // User Story 1: Visual Identification of Overdue Items Tests (T013-T017)
  describe('Overdue Visual Indicators', () => {
    it('T013: should display overdue CSS class for overdue todo', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const overdueTodo = { ...mockTodo, dueDate: yesterdayStr, completed: 0 };
      const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');
    });

    it('T014: should display warning icon for overdue todo', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const overdueTodo = { ...mockTodo, dueDate: yesterdayStr, completed: 0 };
      render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('T015: should NOT display overdue class for non-overdue todo', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const futureTodo = { ...mockTodo, dueDate: tomorrowStr, completed: 0 };
      const { container } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);

      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
    });

    it('T016: should NOT display overdue indicator for completed past-due todo', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const completedOverdueTodo = { ...mockTodo, dueDate: yesterdayStr, completed: 1 };
      const { container } = render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);

      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
      expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
    });

    it('T017: should NOT display overdue indicator for todo without due date', () => {
      const noDueDateTodo = { ...mockTodo, dueDate: null, completed: 0 };
      const { container } = render(<TodoCard todo={noDueDateTodo} {...mockHandlers} isLoading={false} />);

      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
      expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
    });
  });
});
