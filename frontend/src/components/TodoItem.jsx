// components/TodoItem.jsx
import React, { useState } from 'react';
import { formatDate } from '../utils/dateUtils';
import './TodoItem.css';

function TodoItem({ todo, onToggleComplete, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDueDate, setEditedDueDate] = useState(todo.due_date || '');
  const [editedDescription, setEditedDescription] = useState(todo.description || '');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateTodo(todo.id, {
      title: editedTitle,
      description: editedDescription,
      due_date: editedDueDate || null
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedTitle(todo.title);
    setEditedDescription(todo.description || '');
    setEditedDueDate(todo.due_date || '');
    setIsEditing(false);
  };
  
  // Format due date for display
  const formattedDueDate = todo.due_date ? formatDate(new Date(todo.due_date)) : null;
  
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            required
            className="edit-title"
            placeholder="Task title"
          />
          
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="edit-description"
            placeholder="Add description (optional)"
          />
          
          <input
            type="datetime-local"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
            className="edit-due-date"
          />
          
          <div className="edit-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="todo-content">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleComplete(todo.id, todo.completed)}
              />
              <span className="checkmark"></span>
            </label>
            
            <div className="todo-details">
              <h3 className="todo-title">{todo.title}</h3>
              
              {todo.description && (
                <p className="todo-description">{todo.description}</p>
              )}
              
              <div className="todo-meta">
                {formattedDueDate && (
                  <span className={`due-date ${isOverdue(todo.due_date) && !todo.completed ? 'overdue' : ''}`}>
                    Due: {formattedDueDate}
                  </span>
                )}
                <span className="created-at">Created: {formatDate(new Date(todo.created_at))}</span>
              </div>
            </div>
          </div>
          
          <div className="todo-actions">
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit
            </button>
            <button onClick={() => onDeleteTodo(todo.id)} className="delete-btn">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to check if a due date is in the past
function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export default TodoItem;