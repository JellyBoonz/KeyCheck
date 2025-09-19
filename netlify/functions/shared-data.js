// Shared data module for Netlify functions
// This is a simple solution that works with Netlify's stateless nature

const fs = require('fs');
const path = require('path');

// Get the deployed data file path
function getDeployedDataPath() {
    return path.join(__dirname, '..', '..', 'data', 'preorders.json');
}

// Read preorders from deployed file
function readDeployedData() {
    try {
        const dataPath = getDeployedDataPath();
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading deployed data:', error);
    }
    return [];
}

function getPreorders() {
    return readDeployedData();
}

function addPreorder(email, price) {
    const preorders = readDeployedData();
    
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
    
    // For now, just return the new preorder
    // In a real implementation, you'd want to persist this data
    // For demo purposes, we'll just return it
    return newPreorder;
}

function getStats() {
    const preorders = readDeployedData();
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
