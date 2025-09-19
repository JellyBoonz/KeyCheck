# 🎹 KeyCheck - Piano Analysis App

A modern web application for analyzing piano condition using AI technology.

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Modern web browser

### Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the backend server:**
   ```bash
   python3 app.py
   ```
   The API will be available at `http://localhost:5001`

3. **Start the frontend server:**
   ```bash
   python3 -m http.server 8000
   ```
   The website will be available at `http://localhost:8000`

## 📱 Features

### Main Website (`index.html`)
- **Responsive design** - Works on desktop and mobile
- **Animated demo** - Shows the app user flow
- **Preorder system** - Email collection with SQLite storage
- **Modern UI** - Clean, professional design

### Admin Dashboard (`admin.html`)
- **Real-time stats** - Total preorders, daily signups, revenue
- **Preorder management** - View all submitted emails
- **Auto-refresh** - Updates every 30 seconds

## 🗄️ Database

The app uses SQLite (`keycheck.db`) to store:
- Email addresses
- Preorder prices
- Timestamps
- Status tracking

## 🔧 API Endpoints

- `POST /api/preorder` - Submit new preorder
- `GET /api/preorders` - Get all preorders (admin)
- `GET /api/stats` - Get statistics
- `GET /health` - Health check

## 📁 Project Structure

```
keycheck/
├── index.html          # Main promotional website
├── keycheck.html       # App mockup/demo
├── admin.html          # Admin dashboard
├── app.py             # Flask backend
├── requirements.txt   # Python dependencies
├── keycheck.db        # SQLite database (created automatically)
└── images/           # App screenshots
```

## 🎯 Usage

1. **Visit the website:** `http://localhost:8000`
2. **Test the preorder form** - Submit an email
3. **View admin dashboard:** `http://localhost:8000/admin.html`
4. **Check the database** - All emails are stored in SQLite

## 🔒 Security Notes

- Email validation prevents invalid submissions
- Duplicate email prevention
- CORS enabled for local development
- SQLite database is created automatically

## 🚀 Production Deployment

For production, consider:
- **Static hosting:** Netlify, Vercel, GitHub Pages
- **Backend hosting:** Heroku, DigitalOcean, AWS
- **Database:** PostgreSQL for production scale
- **HTTPS:** Required for production

## 📊 Monitoring

The admin dashboard provides:
- Total preorder count
- Daily signup tracking
- Revenue calculations
- Real-time updates

## 🛠️ Development

- **Backend:** Flask with SQLite
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Database:** SQLite (development) / PostgreSQL (production)
- **Styling:** Custom CSS with responsive design

---

**Ready to launch!** 🎉
