// Netlify serverless function for getting preorders (admin only)
const fs = require('fs');
const path = require('path');

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

exports.handler = async (event, context) => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            },
            body: '',
        };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ success: false, error: 'Method not allowed' }),
        };
    }

    try {
        // Basic authentication check (you can enhance this)
        const authHeader = event.headers.authorization;
        const expectedToken = process.env.ADMIN_TOKEN;

        if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Unauthorized'
                }),
            };
        }

        // Get preorders
        const preorders = readPreorders();

        // Calculate stats
        const totalPreorders = preorders.length;
        const today = new Date().toISOString().split('T')[0];
        const todayPreorders = preorders.filter(p => p.timestamp.startsWith(today)).length;
        const totalRevenue = preorders.reduce((sum, p) => sum + p.price, 0);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                preorders: preorders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
                stats: {
                    total_preorders: totalPreorders,
                    today_preorders: todayPreorders,
                    total_revenue: totalRevenue
                }
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
