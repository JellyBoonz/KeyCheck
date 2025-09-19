// Netlify serverless function for handling preorder submissions
// Uses shared in-memory storage for simplicity

const { addPreorder } = require('./shared-data');

// Email validation function
function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
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

        // Add new preorder using shared data
        try {
            const newPreorder = await addPreorder(email, priceNum);

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
            if (error.message === 'Email already registered') {
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
            throw error; // Re-throw other errors
        }

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
