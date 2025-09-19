// Netlify serverless function for getting preorders (admin only)
const fs = require('fs');
const path = require('path');

// Get data file path - always use the deployed data directory
function getDataPath() {
    return path.join(__dirname, '..', '..', 'data', 'preorders.json');
}

// Read preorders from file
function readPreorders() {
    try {
        const dataPath = getDataPath();
        console.log('Reading from path:', dataPath);
        console.log('File exists:', fs.existsSync(dataPath));
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            console.log('File content length:', data.length);
            const parsed = JSON.parse(data);
            console.log('Parsed preorders count:', parsed.length);
            return parsed;
        } else {
            console.log('File does not exist at:', dataPath);
        }
    } catch (error) {
        console.error('Error reading preorders:', error);
        console.error('Error details:', error.message);
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
