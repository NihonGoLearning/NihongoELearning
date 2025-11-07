// main.js - Main and Common Actions for User Management System

// Common utility functions
function formatDate(dateString) {
    try {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

function formatTime(dateString) {
    try {
        if (!dateString) return 'Unknown time';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting time:', error);
        return 'Invalid time';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        max-width: 400px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
    `;
    
    // Set background color based on type
    const colors = {
        info: '#3498db',
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Add click to dismiss
    notification.addEventListener('click', function() {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Form validation
function validateUsername(username) {
    if (!username || typeof username !== 'string') {
        return false;
    }
    
    const cleanUsername = username.trim();
    
    // Check length
    if (cleanUsername.length < 3) {
        return false;
    }
    
    // Check for only letters, numbers, and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
        return false;
    }
    
    // Check if it's not just numbers
    if (/^\d+$/.test(cleanUsername)) {
        return false;
    }
    
    return true;
}

function validatePassword(password) {
    if (!password || typeof password !== 'string') {
        return false;
    }
    
    return password.trim().length >= 6;
}

function validateEmail(email) {
    if (!email) return true; // Email is optional
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// String utilities
function capitalizeFirst(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function truncateText(text, maxLength = 50) {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// LocalStorage utilities
function clearAllData() {
    try {
        const currentUser = getCurrentUser();
        
        localStorage.removeItem('users');
        localStorage.removeItem('userActivities');
        localStorage.removeItem('currentUser');
        
        // Reinitialize user manager
        if (typeof initializeUserManager === 'function') {
            initializeUserManager();
        }
        
        showNotification('All data cleared successfully', 'success');
        return true;
    } catch (error) {
        console.error('Error clearing all data:', error);
        showNotification('Failed to clear data', 'error');
        return false;
    }
}

function getStorageUsage() {
    try {
        let totalSize = 0;
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length * 2; // UTF-16 characters use 2 bytes
            }
        }
        
        return {
            totalBytes: totalSize,
            totalKB: (totalSize / 1024).toFixed(2),
            totalMB: (totalSize / (1024 * 1024)).toFixed(4),
            items: Object.keys(localStorage).length
        };
    } catch (error) {
        console.error('Error calculating storage usage:', error);
        return { totalBytes: 0, totalKB: '0', totalMB: '0', items: 0 };
    }
}

// DOM utilities
function toggleElementVisibility(elementId, show = true) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

function addLoadingState(element) {
    if (!element) return;
    
    element.setAttribute('data-original-text', element.textContent);
    element.innerHTML = '<span class="loading-spinner"></span> Loading...';
    element.disabled = true;
    
    // Add spinner styles if not already added
    if (!document.querySelector('#loading-spinner-styles')) {
        const styles = document.createElement('style');
        styles.id = 'loading-spinner-styles';
        styles.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 1s ease-in-out infinite;
                margin-right: 8px;
                vertical-align: middle;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styles);
    }
}

function removeLoadingState(element) {
    if (!element) return;
    
    const originalText = element.getAttribute('data-original-text');
    if (originalText) {
        element.textContent = originalText;
    }
    element.disabled = false;
}

// Date and time utilities
function getTimeAgo(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return formatDate(dateString);
        }
    } catch (error) {
        console.error('Error calculating time ago:', error);
        return 'unknown time';
    }
}

function isToday(dateString) {
    try {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    } catch (error) {
        return false;
    }
}

// Security utilities
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Basic HTML tag sanitization
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

function generateSecurePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Fill the rest
    for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Export/Import utilities
function exportToJSON(data, filename) {
    try {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
        return true;
    } catch (error) {
        console.error('Export failed:', error);
        showNotification('Export failed: ' + error.message, 'error');
        return false;
    }
}

function importFromJSON(file, callback) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            callback(true, data);
        } catch (error) {
            console.error('Import failed:', error);
            callback(false, 'Invalid JSON file: ' + error.message);
        }
    };
    
    reader.onerror = function() {
        callback(false, 'Error reading file');
    };
    
    reader.readAsText(file);
}

// Session management
function checkSessionTimeout() {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
        const now = new Date().getTime();
        const timeDiff = now - parseInt(lastActivity);
        const timeoutMinutes = 30; // 30 minutes timeout
        const timeoutMs = timeoutMinutes * 60 * 1000;
        
        if (timeDiff > timeoutMs) {
            showNotification('Session expired due to inactivity', 'warning');
            logoutUser();
            window.location.href = '/login.html';
            return false;
        }
    }
    
    // Update last activity
    localStorage.setItem('lastActivity', new Date().getTime().toString());
    return true;
}

function updateLastActivity() {
    localStorage.setItem('lastActivity', new Date().getTime().toString());
}

// UI helpers
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
    }
}

function copyToClipboard(text) {
    try {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('Copied to clipboard!', 'success');
        }).catch(function() {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Copied to clipboard!', 'success');
        });
    } catch (error) {
        console.error('Copy failed:', error);
        showNotification('Copy failed', 'error');
    }
}

// Error handling
function handleError(error, userMessage = 'An error occurred') {
    console.error('Application error:', error);
    
    // Don't show technical errors to users in production
    const message = userMessage; // In development, you might show the actual error
    
    showNotification(message, 'error');
    
    // You could also send errors to a logging service here
    // logErrorToService(error);
}

// Initialize common functionality
function initializeCommonFeatures() {
    // Update last activity on user interaction
    document.addEventListener('click', updateLastActivity);
    document.addEventListener('keypress', updateLastActivity);
    
    // Check session timeout every minute
    setInterval(checkSessionTimeout, 60000);
    
    // Initialize tooltips if any
    initializeTooltips();
    
    console.log('Common features initialized');
}

function initializeTooltips() {
    // Simple tooltip implementation
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            if (tooltipText) {
                showTooltip(e, tooltipText);
            }
        });
        
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event, text) {
    let tooltip = document.getElementById('custom-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'custom-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            max-width: 200px;
            word-wrap: break-word;
        `;
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.style.opacity = '1';
    
    const x = event.clientX + 10;
    const y = event.clientY + 10;
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('custom-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}

// Performance monitoring
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`Performance - ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
}

// Common event handlers and initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common features
    initializeCommonFeatures();
    
    // Add common event listeners
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                logoutUser();
                window.location.href = '/login.html';
            }
        });
    });
    
    // Add enter key support for forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.type !== 'textarea') {
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    e.preventDefault();
                    submitButton.click();
                }
            }
        });
    });
    
    console.log('Main.js initialization complete');
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        formatDate,
        formatTime,
        showNotification,
        validateUsername,
        validatePassword,
        validateEmail,
        capitalizeFirst,
        truncateText,
        clearAllData,
        getStorageUsage,
        getTimeAgo,
        isToday,
        sanitizeInput,
        generateSecurePassword,
        exportToJSON,
        importFromJSON,
        checkSessionTimeout,
        updateLastActivity,
        togglePasswordVisibility,
        copyToClipboard,
        handleError,
        measurePerformance
    };
}
