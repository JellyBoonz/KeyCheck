# 🗄️ Supabase Database Setup for KeyCheck

## Quick Setup Guide

### 1. Create Supabase Project

1. **Go to:** [supabase.com](https://supabase.com)
2. **Sign up/Login** and click "New Project"
3. **Choose organization** and enter project details:
   - **Name:** `keycheck-database`
   - **Database Password:** (choose a strong password)
   - **Region:** Choose closest to your users
4. **Click "Create new project"** (takes ~2 minutes)

### 2. Get Your Credentials

Once your project is ready:

1. **Go to:** Settings → API
2. **Copy these values:**
   - **Project URL:** `https://your-project-id.supabase.co`
   - **Anon/Public Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Create Database Table

1. **Go to:** SQL Editor in Supabase dashboard
2. **Run this SQL:**

```sql
-- Create preorders table
CREATE TABLE preorders (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    price INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending'
);

-- Insert your existing data
INSERT INTO preorders (email, price, timestamp, status) VALUES
('test@test.com', 24, '2025-09-18 11:43:21.667151', 'pending'),
('test@example.com', 24, '2025-09-18 11:42:06.888275', 'pending');
```

### 4. Set Environment Variables in Netlify

1. **Go to:** Netlify Dashboard → Site Settings → Environment Variables
2. **Add these variables:**
   - **Key:** `SUPABASE_URL` **Value:** `https://your-project-id.supabase.co`
   - **Key:** `SUPABASE_ANON_KEY` **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5. Deploy Updated Functions

The functions are already updated to use Supabase. Just commit and push:

```bash
git add .
git commit -m "Add Supabase database integration"
git push
```

## ✅ Benefits of Supabase

- **✅ Real PostgreSQL database** - Production ready
- **✅ Automatic backups** - Never lose data
- **✅ Real-time updates** - Can add live features later
- **✅ Row Level Security** - Secure data access
- **✅ Free tier** - Up to 500MB database, 50MB file storage
- **✅ Easy scaling** - Grows with your app

## 🔧 Local Development

For local development, you can still use SQLite:

```bash
# Start local Flask server
python3 app.py

# Access admin dashboard
open http://localhost:5001/admin.html
```

## 🚀 Production vs Development

- **Development:** Uses SQLite (`keycheck.db`)
- **Production:** Uses Supabase PostgreSQL
- **Same API:** Both use identical endpoints
- **Same Admin Dashboard:** Works with both databases

## 📊 Database Schema

```sql
preorders:
├── id (SERIAL PRIMARY KEY)
├── email (VARCHAR(255) UNIQUE)
├── price (INTEGER)
├── timestamp (TIMESTAMP WITH TIME ZONE)
└── status (VARCHAR(50))
```

## 🔒 Security Features

- **Email uniqueness** - Prevents duplicate signups
- **Input validation** - Sanitizes all data
- **Environment variables** - Keeps credentials secure
- **CORS protection** - Only your domain can access

## 📈 Monitoring

- **Supabase Dashboard:** View all data, run queries
- **Netlify Functions:** Monitor function performance
- **Admin Dashboard:** Real-time preorder tracking

Your production app will now have a proper, scalable database! 🎉
