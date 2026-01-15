/**
 * Date utility functions for todo application
 */

/**
 * Determines if a todo is overdue based on current time
 * @param {Object} todo - Todo object with dueDate and completed fields
 * @param {string|null} todo.dueDate - Due date in ISO format (YYYY-MM-DD) or null
 * @param {number} todo.completed - 0 = incomplete, 1 = complete
 * @returns {boolean} True if incomplete and past due date at 00:00:00
 */
export function isOverdue(todo) {
  // Not overdue if no due date
  if (!todo.dueDate) {
    return false;
  }

  // Not overdue if completed
  if (todo.completed === 1 || todo.completed === true) {
    return false;
  }

  try {
    // Parse the due date and set to end of day (23:59:59.999)
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(23, 59, 59, 999);

    // Get current date/time
    const now = new Date();

    // Overdue if current time is after the end of the due date
    return now > dueDate;
  } catch (error) {
    // If date parsing fails, log warning and return false (not overdue)
    console.warn('Invalid date format in isOverdue:', todo.dueDate, error);
    return false;
  }
}
