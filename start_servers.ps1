# PowerShell script to start both static site and Flask API server
Start-Process powershell -ArgumentList 'cd staticsite; python -m http.server 8080' -WindowStyle Minimized
Start-Process powershell -ArgumentList 'C:/myownsite/.venv/Scripts/python.exe staticsite/register_api.py' -WindowStyle Minimized
Write-Host "Both servers started. Static: http://localhost:8080  |  API: http://localhost:5000 (SQLite3)"