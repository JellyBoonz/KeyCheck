// Shared data module for Netlify functions
// Uses Supabase PostgreSQL database

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read preorders from Supabase
async function readDeployedData() {
    try {
        const { data, error } = await supabase
            .from('preorders')
            .select('*')
            .order('timestamp', { ascending: false });
        
        if (error) {
            console.error('Supabase error:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('Error reading from Supabase:', error);
        return [];
    }
}

async function getPreorders() {
    return await readDeployedData();
}

async function addPreorder(email, price) {
    try {
        // Check for duplicate first
        const { data: existing, error: checkError } = await supabase
            .from('preorders')
            .select('email')
            .eq('email', email.toLowerCase().trim())
            .single();
        
        if (existing) {
            throw new Error('Email already registered');
        }
        
        // Insert new preorder
        const { data, error } = await supabase
            .from('preorders')
            .insert([
                {
                    email: email.toLowerCase().trim(),
                    price: parseInt(price),
                    status: 'pending'
                }
            ])
            .select()
            .single();
        
        if (error) {
            console.error('Supabase insert error:', error);
            throw new Error('Failed to save preorder');
        }
        
        return data;
    } catch (error) {
        if (error.message === 'Email already registered') {
            throw error;
        }
        console.error('Error adding preorder:', error);
        throw new Error('Failed to save preorder');
    }
}

async function getStats() {
    const preorders = await readDeployedData();
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
