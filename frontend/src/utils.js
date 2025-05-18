/**
 * Utility functions for todo app
 */

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return '';
    }
    
    // Format date: May 10, 2025, 2:30 PM
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Format date for input fields
function formatDateForInput(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return '';
    }
    
    // Format date as YYYY-MM-DDThh:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Get priority text from value
function getPriorityText(priority) {
    const priorityMap = {
        1: 'Low',
        2: 'Medium-Low',
        3: 'Medium',
        4: 'Medium-High',
        5: 'High'
    };
    
    return priorityMap[priority] || 'Medium';
}

// Create toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
        <div class="toast-message">${message}</div>
        <span class="toast-close">&times;</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add click event to close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
    
    return toast;
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Sort todos by different criteria
function sortTodos(todos, sortBy) {
    const sortedTodos = [...todos];
    
    switch (sortBy) {
        case 'created-desc':
            return sortedTodos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        case 'created-asc':
            return sortedTodos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        case 'priority-desc':
            return sortedTodos.sort((a, b) => b.priority - a.priority);
        case 'priority-asc':
            return sortedTodos.sort((a, b) => a.priority - b.priority);
        case 'due-date':
            return sortedTodos.sort((a, b) => {
                // Place todos with no due date at the end
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return new Date(a.due_date) - new Date(b.due_date);
            });
        default:
            return sortedTodos;
    }
}

// Check if a date is past due
function isPastDue(dateString) {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const now = new Date();
    
    return date < now;
}

// Format relative time (e.g., "2 days ago", "in 3 hours")
function formatRelativeTime(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffDay < 0) {
        if (diffDay === -1) return 'yesterday';
        if (diffDay > -7) return `${Math.abs(diffDay)} days ago`;
        return formatDate(dateString);
    }
    
    if (diffDay === 0) {
        if (diffHour < 0) {
            if (diffHour === -1) return '1 hour ago';
            return `${Math.abs(diffHour)} hours ago`;
        }
        if (diffHour === 0) {
            if (diffMin < 0) {
                if (diffMin === -1) return '1 minute ago';
                return `${Math.abs(diffMin)} minutes ago`;
            }
            if (diffMin === 0) return 'just now';
            if (diffMin === 1) return 'in 1 minute';
            return `in ${diffMin} minutes`;
        }
        if (diffHour === 1) return 'in 1 hour';
        return `in ${diffHour} hours`;
    }
    
    if (diffDay === 1) return 'tomorrow';
    if (diffDay < 7) return `in ${diffDay} days`;
    return formatDate(dateString);
}