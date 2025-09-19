# 🎹 KeyCheck - AI Piano Analysis App

A promotional website and admin dashboard for the KeyCheck piano analysis application.

## 🚀 Quick Start

### Local Development

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Flask server:**
   ```bash
   python3 app.py
   ```

3. **Open the admin dashboard:**
   ```
   http://localhost:5001/admin.html
   ```

4. **Enter admin token:** `8f1b4683929510d3c32b4420c196bf8b416f9a85a2ebd07412378abb511f457a`

### Production Setup

1. **Set up Supabase database** (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md))
2. **Deploy to Netlify** with environment variables
3. **Configure admin token** in Netlify dashboard

## 📁 Project Structure

```
keycheck/
├── index.html              # Promotional website
├── keycheck.html           # App mockup/demo
├── admin.html              # Admin dashboard
├── app.py                  # Flask backend (local dev)
├── requirements.txt        # Python dependencies
├── netlify/
│   └── functions/          # Serverless functions
│       ├── submit-preorder.js
│       ├── get-preorders.js
│       ├── shared-data.js
│       └── package.json
└── SUPABASE_SETUP.md       # Database setup guide
```

## 🗄️ Database

- **Development:** SQLite (`keycheck.db`)
- **Production:** Supabase PostgreSQL

## 🔧 Features

- **Promotional Website:** Modern, responsive design
- **App Demo:** Interactive phone mockup with user flow
- **Preorder System:** Email collection with validation
- **Admin Dashboard:** Real-time preorder tracking
- **Mobile Responsive:** Optimized for all devices

## 📊 Admin Dashboard

Access the admin dashboard to:
- View total preorders and revenue
- See today's signups
- Monitor email submissions
- Track conversion metrics

## 🚀 Deployment

The app is designed for easy deployment on Netlify:

1. **Connect GitHub repository**
2. **Set environment variables:**
   - `ADMIN_TOKEN` - Admin dashboard access
   - `SUPABASE_URL` - Database connection
   - `SUPABASE_ANON_KEY` - Database API key
3. **Deploy automatically** on git push

## 🔒 Security

- **Token-based admin access**
- **Email validation and deduplication**
- **CORS protection**
- **Input sanitization**

## 📱 Mobile Support

- **Responsive design** for all screen sizes
- **Touch-friendly** interface
- **Mobile-optimized** admin dashboard
- **Progressive Web App** ready

## 🎯 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Python Flask (dev), Netlify Functions (prod)
- **Database:** SQLite (dev), Supabase PostgreSQL (prod)
- **Deployment:** Netlify
- **Styling:** Custom CSS with modern design patterns

## 📈 Analytics

Track your preorder success:
- **Total signups**
- **Daily conversion rates**
- **Revenue tracking**
- **Email list growth**

## 🛠️ Development

### Adding New Features

1. **Local development:** Use Flask server
2. **Test thoroughly** on mobile and desktop
3. **Update Netlify functions** for production
4. **Deploy** via git push

### Database Schema

```sql
preorders:
├── id (SERIAL PRIMARY KEY)
├── email (VARCHAR(255) UNIQUE)
├── price (INTEGER)
├── timestamp (TIMESTAMP WITH TIME ZONE)
└── status (VARCHAR(50))
```

## 📞 Support

For questions or issues:
1. Check the [SUPABASE_SETUP.md](SUPABASE_SETUP.md) guide
2. Review the deployment logs in Netlify
3. Test locally with `python3 app.py`

---

**Ready to launch your piano analysis app!** 🎹✨