from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database setup
DB_NAME = 'keycheck.db'

def init_db():
    """Initialize the SQLite database"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Create the preorders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS preorders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            price INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'pending'
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database {DB_NAME} initialized successfully")

def validate_email(email):
    """Validate email format"""
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

@app.route('/api/preorder', methods=['POST'])
def submit_preorder():
    """Handle preorder submissions"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'email' not in data or 'price' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing email or price'
            }), 400
        
        email = data['email'].strip().lower()
        price = int(data['price'])
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # Validate price
        if price <= 0:
            return jsonify({
                'success': False,
                'error': 'Invalid price'
            }), 400
        
        # Save to database
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO preorders (email, price, timestamp)
                VALUES (?, ?, ?)
            ''', (email, price, datetime.now()))
            
            conn.commit()
            
            return jsonify({
                'success': True,
                'message': 'Preorder submitted successfully',
                'email': email,
                'price': price
            })
            
        except sqlite3.IntegrityError:
            return jsonify({
                'success': False,
                'error': 'Email already registered'
            }), 409
        
        finally:
            conn.close()
            
    except Exception as e:
        print(f"Error processing preorder: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/preorders', methods=['GET'])
def get_preorders():
    """Get all preorders (admin endpoint)"""
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, email, price, timestamp, status
            FROM preorders
            ORDER BY timestamp DESC
        ''')
        
        preorders = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        result = []
        for row in preorders:
            result.append({
                'id': row[0],
                'email': row[1],
                'price': row[2],
                'timestamp': row[3],
                'status': row[4]
            })
        
        return jsonify({
            'success': True,
            'preorders': result,
            'count': len(result)
        })
        
    except Exception as e:
        print(f"Error fetching preorders: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get basic statistics"""
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # Count total preorders
        cursor.execute('SELECT COUNT(*) FROM preorders')
        total_count = cursor.fetchone()[0]
        
        # Count today's preorders
        cursor.execute('''
            SELECT COUNT(*) FROM preorders
            WHERE DATE(timestamp) = DATE('now')
        ''')
        today_count = cursor.fetchone()[0]
        
        # Total revenue
        cursor.execute('SELECT SUM(price) FROM preorders')
        total_revenue = cursor.fetchone()[0] or 0
        
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_preorders': total_count,
                'today_preorders': today_count,
                'total_revenue': total_revenue
            }
        })
        
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'KeyCheck API is running',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Run the Flask app
    print("Starting KeyCheck API server...")
    print("API endpoints:")
    print("  POST /api/preorder - Submit preorder")
    print("  GET  /api/preorders - Get all preorders")
    print("  GET  /api/stats - Get statistics")
    print("  GET  /health - Health check")
    print("\nServer running at: http://localhost:5001")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
