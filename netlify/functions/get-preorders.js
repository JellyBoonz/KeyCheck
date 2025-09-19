// Netlify serverless function for getting preorders (admin only)
const { getPreorders, getStats } = require('./shared-data');


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

        // Get preorders and stats using shared data
        const preorders = await getPreorders();
        const stats = await getStats();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                preorders: preorders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
                stats: stats
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
