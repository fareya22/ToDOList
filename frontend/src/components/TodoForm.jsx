// TodoForm.jsx
import React, { useState } from 'react';

const TodoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    text: '',
    completed: false,
    priority: 1,
    due_date: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create the todo object with the proper format
    const todoData = {
      text: formData.text,
      completed: formData.completed,
      priority: parseInt(formData.priority) || 1
    };
    
    // Only add due_date if it's not empty
    if (formData.due_date) {
      // Convert the date to ISO format which is compatible with FastAPI's datetime
      todoData.due_date = new Date(formData.due_date).toISOString();
    }
    
    onSubmit(todoData);
    
    // Reset the form
    setFormData({
      text: '',
      completed: false,
      priority: 1,
      due_date: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <label htmlFor="text">Task:</label>
        <input
          type="text"
          id="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          required
          placeholder="What needs to be done?"
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="priority">Priority (1-5):</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="form-control"
        >
          <option value="1">1 (Low)</option>
          <option value="2">2</option>
          <option value="3">3 (Medium)</option>
          <option value="4">4</option>
          <option value="5">5 (High)</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="due_date">Due Date (optional):</label>
        <input
          type="datetime-local"
          id="due_date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      
      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
          />
          Completed
        </label>
      </div>
      
      <button type="submit" className="btn btn-primary">Add Todo</button>
    </form>
  );
};

export default TodoForm;