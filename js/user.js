// User data and management
class UserManager {
    constructor() {
        this.users = this.loadUsers();
        this.initializeAdmin();
    }

    loadUsers() {
        try {
            const stored = localStorage.getItem('users');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('users', JSON.stringify(this.users));
            return true;
        } catch (error) {
            console.error('Error saving users:', error);
            return false;
        }
    }

    initializeAdmin() {
        const adminExists = this.users.some(user => user.username === 'admin');
        if (!adminExists) {
            this.users.push({
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            });
            this.saveUsers();
        }
    }

    validateUser(username, password) {
        return this.users.find(user => 
            user.username === username && user.password === password
        );
    }

///////////**********
    createUser(username, password) {
        console.log('Creating user:', username); // Debug log
        
        // Validate input
        if (!username || !password) {
            console.log('Missing username or password');
            return false;
        }

        // Check if username already exists
        if (this.users.some(user => user.username === username)) {
            console.log('Username already exists:', username);
            return false; // Username exists
        }

        // Create new user object
        const newUser = {
            username: username.trim(),
            password: password,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        console.log('New user object:', newUser); // Debug log

        // Add to users array
        this.users.push(newUser);

        // Save to localStorage
        const saved = this.saveUsers();
        console.log('Save successful:', saved); // Debug log

        if (saved) {
            this.recordActivity('system', `User ${username} created`);
            console.log('User created successfully'); // Debug log
        } else {
            console.log('Failed to save user'); // Debug log
        }

        return saved;
    }

    deleteUser(username) {
        console.log('Attempting to delete user:', username); // Debug log
        
        if (username === 'admin') {
            console.log('Cannot delete admin user');
            return false; // Cannot delete admin
        }
        
        const index = this.users.findIndex(user => user.username === username);
        console.log('User found at index:', index); // Debug log
        
        if (index !== -1) {
            this.users.splice(index, 1);
            const saved = this.saveUsers();
            console.log('Save successful:', saved); // Debug log
            
            if (saved) {
                // Clean up user activities
                this.cleanupUserActivities(username);
                this.recordActivity('system', `User ${username} deleted and all data cleared`);
            }
            return saved;
        }
        
        console.log('User not found for deletion');
        return false;
    }

    // Clean up user activities
    cleanupUserActivities(username) {
        try {
            const activities = this.loadActivities();
            // Filter out activities belonging to the deleted user
            const filteredActivities = activities.filter(activity => 
                activity.username !== username
            );
            localStorage.setItem('userActivities', JSON.stringify(filteredActivities));
            return true;
        } catch (error) {
            console.error('Error cleaning up user activities:', error);
            return false;
        }
    }

    getAllUsers() {
        return this.users.filter(user => user.username !== 'admin');
    }

    recordActivity(username, description) {
        try {
            const activities = this.loadActivities();
            activities.push({
                username,
                description,
                timestamp: new Date().toLocaleString()
            });
            localStorage.setItem('userActivities', JSON.stringify(activities));
            return true;
        } catch (error) {
            console.error('Error recording activity:', error);
            return false;
        }
    }

    loadActivities() {
        try {
            const stored = localStorage.getItem('userActivities');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading activities:', error);
            return [];
        }
    }

    getUserActivities(username) {
        const activities = this.loadActivities();
        return activities.filter(activity => activity.username === username);
    }

    // Get storage usage information
    getStorageInfo() {
        const usersSize = localStorage.getItem('users') ? 
            new Blob([localStorage.getItem('users')]).size : 0;
        const activitiesSize = localStorage.getItem('userActivities') ? 
            new Blob([localStorage.getItem('userActivities')]).size : 0;
        
        return {
            users: {
                count: this.users.length,
                size: usersSize
            },
            activities: {
                count: this.loadActivities().length,
                size: activitiesSize
            },
            totalSize: usersSize + activitiesSize
        };
    }

    // Add this method to the UserManager class
    getUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }
}

// Global user manager instance
let userManager;

// Initialize user manager safely
function initializeUserManager() {
    try {
        userManager = new UserManager();
        return true;
    } catch (error) {
        console.error('Failed to initialize user manager:', error);
        return false;
    }
}

// Initialize immediately
initializeUserManager();

// Authentication functions
function loginUser(username, password) {
    if (!userManager) return false;
    
    const user = userManager.validateUser(username, password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        userManager.recordActivity(username, 'User logged in');
        return true;
    }
    return false;
}

function logoutUser() {
    const currentUser = getCurrentUser();
    if (currentUser && userManager) {
        userManager.recordActivity(currentUser.username, 'User logged out');
    }
    localStorage.removeItem('currentUser');
}

function getCurrentUser() {
    try {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function createUser(username, password) {
    return userManager ? userManager.createUser(username, password) : false;
}

function deleteUser(username) {
    if (!userManager) {
        console.error('User manager not initialized');
        return false;
    }
    return userManager.deleteUser(username);
}

function getAllUsers() {
    return userManager ? userManager.getAllUsers() : [];
}

function getUserActivities(username) {
    return userManager ? userManager.getUserActivities(username) : [];
}

function recordActivity(username, description) {
    if (userManager) {
        userManager.recordActivity(username, description);
    }
}

// Get storage information
function getStorageInfo() {
    return userManager ? userManager.getStorageInfo() : null;
}

// Clear all data (for testing/reset)
function clearAllData() {
    try {
        localStorage.removeItem('users');
        localStorage.removeItem('userActivities');
        localStorage.removeItem('currentUser');
        initializeUserManager(); // Reinitialize
        return true;
    } catch (error) {
        console.error('Error clearing all data:', error);
        return false;
    }

}
