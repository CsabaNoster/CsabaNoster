# Simple static file server for your staticsite folder
# Run this script from the root of your project (where staticsite/ is)
# Usage: python serve_static.py

import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = "staticsite"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving static files at http://localhost:{PORT}/")
        httpd.serve_forever()
