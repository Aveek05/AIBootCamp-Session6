import React, { useState, useEffect, useMemo } from 'react';
import TodoCard from './TodoCard';
import { isOverdue } from '../utils/dateUtils';

function TodoList({ todos, onToggle, onEdit, onDelete, isLoading }) {
  // State to track current time for real-time overdue updates
  const [currentTime, setCurrentTime] = useState(new Date());

  // Calculate overdue count using useMemo
  const overdueCount = useMemo(() => {
    return todos.filter(todo => isOverdue(todo)).length;
  }, [todos, currentTime]);

  // Set up interval to update current time every 60 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60 seconds

    // Cleanup function to clear interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (todos.length === 0) {
    return (
      <div className="todo-list empty-state">
        <p className="empty-state-message">
          No todos yet. Add one to get started! 👻
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {overdueCount > 0 && (
        <div className="overdue-summary">
          ⚠️ {overdueCount} overdue {overdueCount === 1 ? 'item' : 'items'}
        </div>
      )}
      {todos.map((todo) => (
        <TodoCard
          key={`${todo.id}-${currentTime.getTime()}`}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

export default TodoList;
