// Shared data module for Netlify functions
// This is a simple in-memory solution for demo purposes

let preorders = [];

// Initialize with default data
function initializeData() {
    if (preorders.length === 0) {
        preorders = [
            {
                "id": 2,
                "email": "test@test.com",
                "price": 24,
                "timestamp": "2025-09-18 11:43:21.667151",
                "status": "pending"
            },
            {
                "id": 1,
                "email": "test@example.com",
                "price": 24,
                "timestamp": "2025-09-18 11:42:06.888275",
                "status": "pending"
            }
        ];
    }
}

function getPreorders() {
    initializeData();
    return preorders;
}

function addPreorder(email, price) {
    initializeData();
    
    // Check for duplicate
    const existing = preorders.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        throw new Error('Email already registered');
    }
    
    // Add new preorder
    const newPreorder = {
        id: Date.now(),
        email: email.toLowerCase().trim(),
        price: parseInt(price),
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    preorders.push(newPreorder);
    return newPreorder;
}

function getStats() {
    initializeData();
    const totalPreorders = preorders.length;
    const today = new Date().toISOString().split('T')[0];
    const todayPreorders = preorders.filter(p => p.timestamp.startsWith(today)).length;
    const totalRevenue = preorders.reduce((sum, p) => sum + p.price, 0);
    
    return {
        total_preorders: totalPreorders,
        today_preorders: todayPreorders,
        total_revenue: totalRevenue
    };
}

module.exports = {
    getPreorders,
    addPreorder,
    getStats
};
