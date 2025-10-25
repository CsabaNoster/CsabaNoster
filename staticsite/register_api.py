# register_api.py
# Simple Flask API for registration with SQLite3 and secure password hashing

from flask import Flask, request, jsonify, send_from_directory
import os
import sqlite3
import re
import bcrypt

app = Flask(__name__)
STATIC_DIR = os.path.abspath(os.path.dirname(__file__))

# Serve static files
@app.route('/')
def index():
    return send_from_directory(STATIC_DIR, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(STATIC_DIR, path)
DB_PATH = 'users.db'

# Create users table if not exists
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)''')
conn.commit()
conn.close()

# Email validation regex
EMAIL_REGEX = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    # Basic validation
    if not username or not email or not password:
        return jsonify(success=False, error='All fields required.'), 400
    if not EMAIL_REGEX.match(email):
        return jsonify(success=False, error='Invalid email.'), 400
    if len(password) < 8:
        return jsonify(success=False, error='Password too short.'), 400

    # Hash password
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Store in DB
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                  (username, email, hashed.decode('utf-8')))
        conn.commit()
        conn.close()
        return jsonify(success=True)
    except sqlite3.IntegrityError:
        return jsonify(success=False, error='Username or email already exists.'), 409
    except Exception:
        return jsonify(success=False, error='Server error.'), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
