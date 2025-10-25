from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import json


app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'dev-secret-key'  # For session cookies

USERS_FILE = os.path.join(os.path.dirname(__file__), 'users.json')

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f)

@app.route('/api/login', methods=['POST'])
def login():
    users = load_users()
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')
    if username in users and users[username]['password'] == password:
        resp = make_response(jsonify({'success': True}), 200)
        resp.set_cookie('session_user', username, httponly=True, samesite='Lax')
        return resp
    else:
        return jsonify({'success': False, 'error': 'Invalid username or password.'}), 401

@app.route('/api/register', methods=['POST'])
def register():
    users = load_users()
    data = request.get_json()
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    if not username or not email or not password:
        return jsonify({'success': False, 'error': 'All fields are required.'}), 400
    if username in users:
        return jsonify({'success': False, 'error': 'Username already exists.'}), 409
    users[username] = {'email': email, 'password': password}
    save_users(users)
    return jsonify({'success': True}), 201



# Real endpoint for authentication status
@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    username = request.cookies.get('session_user')
    if username:
        return jsonify({'authenticated': True, 'username': username})
    else:
        return jsonify({'authenticated': False})

# Logout endpoint
@app.route('/api/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({'success': True}))
    resp.set_cookie('session_user', '', expires=0)
    return resp

if __name__ == '__main__':
    app.run(port=5000, debug=True)
