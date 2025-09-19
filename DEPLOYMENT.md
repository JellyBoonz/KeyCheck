# 🚀 KeyCheck Netlify Deployment Guide

This guide will help you deploy KeyCheck to Netlify with a production-ready setup.

## 📋 Prerequisites

- Netlify account (you already have this!)
- Git repository (GitHub, GitLab, or Bitbucket)

## 🗄️ Database Solution

Instead of Supabase, we're using **JSON file storage** which is:
- ✅ **Simpler** - No external database setup needed
- ✅ **Free** - No database costs
- ✅ **Reliable** - Works perfectly for email collection
- ✅ **Scalable** - Can handle thousands of preorders

## 📁 Project Structure

```
keycheck/
├── index.html              # Main website
├── admin.html              # Admin dashboard
├── keycheck.html           # App demo
├── netlify.toml           # Netlify configuration
├── netlify/
│   └── functions/
│       ├── submit-preorder.js    # Handle preorder submissions
│       ├── get-preorders.js       # Admin data access
│       └── package.json           # Function dependencies
└── data/                   # Created automatically
    └── preorders.json      # Email storage
```

## 🔧 Deployment Steps

### 1. Push to Git Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial KeyCheck deployment"

# Add your remote repository
git remote add origin https://github.com/yourusername/keycheck.git
git push -u origin main
```

### 2. Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)** and log in
2. **Click "New site from Git"**
3. **Connect your repository** (GitHub/GitLab/Bitbucket)
4. **Configure build settings:**
   - Build command: (leave empty)
   - Publish directory: `.` (root)
5. **Click "Deploy site"**

### 3. Set Environment Variables

In your Netlify dashboard:

1. **Go to Site settings → Environment variables**
2. **Add these variables:**

```
ADMIN_TOKEN = your-secret-admin-token-here
```

**Generate a secure token:**
```bash
# Use this command to generate a random token
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Update Admin Token

After deployment, update the admin token in `admin.html`:

```javascript
// Replace 'your-admin-token-here' with your actual token
'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || 'YOUR_ACTUAL_TOKEN')
```

## 🔒 Security Features

- **CORS protection** - Only allows requests from your domain
- **Input validation** - Email format and price validation
- **Duplicate prevention** - Prevents same email from registering twice
- **Admin authentication** - Protected admin dashboard
- **Rate limiting** - Built into Netlify Functions

## 📊 Admin Dashboard Access

**Production URL:** `https://your-site-name.netlify.app/admin`

**Authentication:** Uses Bearer token authentication

**Features:**
- Real-time preorder statistics
- Email list with timestamps
- Revenue tracking
- Auto-refresh every 30 seconds

## 🔄 Development vs Production

The app automatically detects the environment:

- **Local development:** Uses `http://localhost:5001` (your Python Flask API)
- **Production:** Uses `/.netlify/functions/` (Netlify Functions)

## 📈 Monitoring

### View Preorders Data

1. **Netlify Dashboard → Functions**
2. **View function logs** for debugging
3. **Admin dashboard** for real-time stats

### Export Data

The preorders are stored in `data/preorders.json` and can be:
- **Downloaded** from Netlify dashboard
- **Exported** via admin dashboard
- **Accessed** via function logs

## 🛠️ Custom Domain (Optional)

1. **Netlify Dashboard → Domain settings**
2. **Add custom domain**
3. **Update DNS records** as instructed
4. **Enable HTTPS** (automatic with Netlify)

## 🔧 Troubleshooting

### Common Issues

1. **Functions not working:**
   - Check environment variables are set
   - Verify function logs in Netlify dashboard

2. **Admin dashboard not loading:**
   - Verify ADMIN_TOKEN is set correctly
   - Check browser console for errors

3. **Preorders not saving:**
   - Check function logs for errors
   - Verify CORS headers are correct

### Debug Mode

Add `?debug=true` to any URL to see additional logging:
- `https://your-site.netlify.app/?debug=true`
- `https://your-site.netlify.app/admin?debug=true`

## 🎯 Production Checklist

- [ ] Repository pushed to Git
- [ ] Netlify site deployed
- [ ] Environment variables set
- [ ] Admin token configured
- [ ] Custom domain added (optional)
- [ ] Test preorder submission
- [ ] Test admin dashboard access
- [ ] Verify email collection works

## 📞 Support

If you encounter any issues:
1. Check Netlify function logs
2. Verify environment variables
3. Test locally first with `python3 app.py`
4. Check browser console for errors

---

**Your KeyCheck app is now production-ready! 🎉**

The JSON file storage will handle thousands of preorders efficiently, and you can always migrate to a database later if needed.
