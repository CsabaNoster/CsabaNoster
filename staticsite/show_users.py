import sqlite3

DB_PATH = 'users.db'

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute('SELECT username, email FROM users')
rows = c.fetchall()
conn.close()

print('Registered users:')
for username, email in rows:
    print(f'- {username} ({email})')
