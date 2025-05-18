// App.jsx - Main Application Component
import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import FilterBar from './components/FilterBar';
import { getTodos, createTodo, updateTodo, deleteTodo } from './services/TodoService';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error('Error loading todos:', err);
      setError('Failed to load todos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todoData) => {
    try {
      setLoading(true);
      const newTodo = await createTodo(todoData);
      setTodos([...todos, newTodo]);
      setError(null);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      setLoading(true);
      const updatedTodo = await updateTodo(id, { completed: !completed });
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setError(null);
    } catch (err) {
      console.error(`Error toggling todo ${id}:`, err);
      setError('Failed to update todo. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      setLoading(true);
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      console.error(`Error deleting todo ${id}:`, err);
      setError('Failed to delete todo. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Todo App</h1>
      </header>
      
      <main className="app-main">
        <section className="form-section">
          <h2>Add New Todo</h2>
          <TodoForm onSubmit={handleAddTodo} />
        </section>
        
        {error && <div className="error-message">{error}</div>}
        
        <section className="list-section">
          <h2>My Todos</h2>
          {loading && <div className="loading">Loading...</div>}
          {!loading && todos.length === 0 ? (
            <p>No todos yet. Add one above!</p>
          ) : (
            <TodoList
              todos={todos}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
            />
          )}
        </section>
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Todo App</p>
      </footer>
    </div>
  );
}

export default App;