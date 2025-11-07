// Show notifications
showNotification('User created successfully', 'success');

// Validate form input
if (validateUsername(username)) {
    // Proceed with user creation
}

// Export data
exportToJSON(data, 'backup.json');

// Format dates
const formatted = formatDate(user.createdAt);

// Check session
checkSessionTimeout();
