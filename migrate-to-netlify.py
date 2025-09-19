#!/usr/bin/env python3
"""
Migration script to export SQLite data to JSON format for Netlify deployment
"""

import sqlite3
import json
import os
from datetime import datetime

def migrate_sqlite_to_json():
    """Export SQLite preorders to JSON format"""
    
    # Check if SQLite database exists
    db_path = 'keycheck.db'
    if not os.path.exists(db_path):
        print("❌ SQLite database not found. Run this script from the project root.")
        return
    
    try:
        # Connect to SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all preorders
        cursor.execute('''
            SELECT id, email, price, timestamp, status
            FROM preorders
            ORDER BY timestamp DESC
        ''')
        
        preorders = []
        for row in cursor.fetchall():
            preorders.append({
                'id': row[0],
                'email': row[1],
                'price': row[2],
                'timestamp': row[3],
                'status': row[4]
            })
        
        conn.close()
        
        # Create data directory
        data_dir = 'data'
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
        
        # Write to JSON file
        json_path = os.path.join(data_dir, 'preorders.json')
        with open(json_path, 'w') as f:
            json.dump(preorders, f, indent=2)
        
        print(f"✅ Successfully migrated {len(preorders)} preorders to {json_path}")
        
        # Show summary
        if preorders:
            total_revenue = sum(p['price'] for p in preorders)
            print(f"📊 Summary:")
            print(f"   - Total preorders: {len(preorders)}")
            print(f"   - Total revenue: ${total_revenue}")
            print(f"   - Latest preorder: {preorders[0]['email']} ({preorders[0]['timestamp']})")
        
        print(f"\n🚀 Ready for Netlify deployment!")
        print(f"   - Upload the entire project to your Git repository")
        print(f"   - Deploy to Netlify")
        print(f"   - Set ADMIN_TOKEN environment variable")
        
    except Exception as e:
        print(f"❌ Error migrating data: {e}")

if __name__ == "__main__":
    migrate_sqlite_to_json()
