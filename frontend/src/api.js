/**
 * API service for interacting with the backend
 */
const API_BASE_URL = 'http://localhost:8000/api';

class TodoApi {
    /**
     * Fetch all todos with optional filtering and pagination
     * @param {Object} options - Options for fetching todos
     * @param {number} options.skip - Number of todos to skip (for pagination)
     * @param {number} options.limit - Maximum number of todos to fetch
     * @param {boolean} options.completed - Filter todos by completion status
     * @returns {Promise<Array>} - Promise resolving to array of todos
     */
    static async getTodos({ skip = 0, limit = 10, completed = null } = {}) {
        let url = `${API_BASE_URL}/todos?skip=${skip}&limit=${limit}`;
        
        if (completed !== null) {
            url += `&completed=${completed}`;
        }
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error fetching todos: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch todos:', error);
            throw error;
        }
    }
    
    /**
     * Fetch a single todo by ID
     * @param {string} id - Todo ID
     * @returns {Promise<Object>} - Promise resolving to todo object
     */
    static async getTodo(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`);
            
            if (!response.ok) {
                throw new Error(`Error fetching todo: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch todo with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Create a new todo
     * @param {Object} todoData - Todo data
     * @returns {Promise<Object>} - Promise resolving to created todo
     */
    static async createTodo(todoData) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todoData)
            });
            
            if (!response.ok) {
                throw new Error(`Error creating todo: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to create todo:', error);
            throw error;
        }
    }
    
    /**
     * Update an existing todo
     * @param {string} id - Todo ID
     * @param {Object} todoData - Updated todo data
     * @returns {Promise<Object>} - Promise resolving to updated todo
     */
    static async updateTodo(id, todoData) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todoData)
            });
            
            if (!response.ok) {
                throw new Error(`Error updating todo: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Failed to update todo with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Delete a todo
     * @param {string} id - Todo ID
     * @returns {Promise<void>}
     */
    static async deleteTodo(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Error deleting todo: ${response.statusText}`);
            }
            
            return true;
        } catch (error) {
            console.error(`Failed to delete todo with ID ${id}:`, error);
            throw error;
        }
    }
}