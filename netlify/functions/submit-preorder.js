// Netlify serverless function for handling preorder submissions
// Uses JSON file storage (simpler than SQLite for serverless)

const fs = require('fs');
const path = require('path');

// Email validation function
function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

// Get data file path - use /tmp for Netlify functions
function getDataPath() {
    // Try to use the data directory first, fallback to /tmp
    const dataDir = path.join(__dirname, '..', '..', 'data');
    if (fs.existsSync(dataDir)) {
        return path.join(dataDir, 'preorders.json');
    }
    // Fallback to /tmp directory for Netlify functions
    return '/tmp/preorders.json';
}

// Ensure data directory exists
function ensureDataDir() {
    const dataPath = getDataPath();
    const dataDir = path.dirname(dataPath);
    if (!fs.existsSync(dataDir)) {
        try {
            fs.mkdirSync(dataDir, { recursive: true });
        } catch (error) {
            console.error('Error creating data directory:', error);
        }
    }
}

// Read preorders from file
function readPreorders() {
    try {
        const dataPath = getDataPath();
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading preorders:', error);
    }
    return [];
}

// Write preorders to file
function writePreorders(preorders) {
    try {
        ensureDataDir();
        const dataPath = getDataPath();
        console.log('Writing to path:', dataPath);
        fs.writeFileSync(dataPath, JSON.stringify(preorders, null, 2));
        console.log('Successfully wrote preorders');
        return true;
    } catch (error) {
        console.error('Error writing preorders:', error);
        console.error('Error details:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
}

exports.handler = async (event, context) => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
            body: '',
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ success: false, error: 'Method not allowed' }),
        };
    }

    try {
        // Parse request body
        const data = JSON.parse(event.body);
        const { email, price } = data;

        // Validate required fields
        if (!email || !price) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Missing email or price'
                }),
            };
        }

        // Validate email format
        if (!validateEmail(email)) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid email format'
                }),
            };
        }

        // Validate price
        const priceNum = parseInt(price);
        if (priceNum <= 0) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid price'
                }),
            };
        }

        // Read existing preorders
        const preorders = readPreorders();

        // Check for duplicate email
        const existingPreorder = preorders.find(p => p.email.toLowerCase() === email.toLowerCase());
        if (existingPreorder) {
            return {
                statusCode: 409,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Email already registered'
                }),
            };
        }

        // Add new preorder
        const newPreorder = {
            id: Date.now(), // Simple ID generation
            email: email.toLowerCase().trim(),
            price: priceNum,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        preorders.push(newPreorder);

        // Write back to file
        if (!writePreorders(preorders)) {
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Failed to save preorder'
                }),
            };
        }

        // Success response
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                message: 'Preorder submitted successfully',
                email: email,
                price: priceNum
            }),
        };

    } catch (error) {
        console.error('Function error:', error);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: false,
                error: 'Internal server error'
            }),
        };
    }
};
