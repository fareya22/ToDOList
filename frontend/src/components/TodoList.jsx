// TodoList.jsx
import React from 'react';

const TodoList = ({ todos, onToggleComplete, onDelete }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Helper function to get priority text
  const getPriorityText = (priority) => {
    const priorityMap = {
      1: 'Low',
      2: 'Low-Medium',
      3: 'Medium',
      4: 'Medium-High',
      5: 'High'
    };
    return priorityMap[priority] || 'Unknown';
  };

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <div 
          key={todo.id} 
          className={`todo-item ${todo.completed ? 'completed' : ''}`}
        >
          <div className="todo-header">
            <h3>{todo.text}</h3>
            <div className="todo-actions">
              <button 
                onClick={() => onToggleComplete(todo.id, todo.completed)}
                className="btn btn-toggle"
              >
                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button 
                onClick={() => onDelete(todo.id)}
                className="btn btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div className="todo-details">
            <p className="todo-priority">
              Priority: <span className={`priority-${todo.priority}`}>
                {getPriorityText(todo.priority)}
              </span>
            </p>
            <p className="todo-due-date">
              Due: {formatDate(todo.due_date)}
            </p>
            <p className="todo-timestamps">
              Created: {formatDate(todo.created_at)} | 
              Updated: {formatDate(todo.updated_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;