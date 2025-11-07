/* User Management Page Styles */
.user-management-panel {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f4f4f4;
}

.user-stats {
    background: #3498db;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: bold;
}

.activity-filters {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 5px;
}

.filter-controls {
    display: flex;
    align-items: center;
}

.activities-section {
    margin-bottom: 2rem;
}

.activity-list {
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 5px;
    padding: 1rem;
}

.user-actions {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 5px;
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

/* Activity item styles */
.activity-item {
    transition: all 0.3s ease;
}

.activity-item:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.activity-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.activity-desc {
    color: #2c3e50;
    flex: 1;
    margin-right: 1rem;
}

.activity-time {
    color: #7f8c8d;
    font-size: 0.85rem;
    white-space: nowrap;
}

/* Button styles */
.view-btn {
    background: #3498db !important;
    color: white !important;
}

.view-btn:hover {
    background: #2980b9 !important;
}

.back-btn:hover {
    background: #7f8c8d !important;
}

.export-btn:hover {
    background: #219a52 !important;
}

.delete-activities-btn:hover {
    background: #d35400 !important;
}

.delete-user-btn:hover {
    background: #c0392b !important;
}

/* Responsive design */
@media (max-width: 768px) {
    .user-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .filter-controls {
        flex-direction: column;
        gap: 1rem;
    }
    
    .filter-controls input {
        width: 100% !important;
    }
}
