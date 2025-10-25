# PowerShell script to copy all necessary Astro assets to the static site
# Run this from the root of your project (where package.json is)

# Copy CSS files
Copy-Item -Force src\styles.css staticsite\styles.css
if (Test-Path src\styles.cyberpunk.css) { Copy-Item -Force src\styles.cyberpunk.css staticsite\styles.cyberpunk.css }

# Copy images, backgrounds, uploads, videos, downloads, js
$folders = @('img', 'backgrounds', 'uploads', 'videos', 'downloads', 'js')
foreach ($folder in $folders) {
    if (Test-Path "public\$folder") {
        Copy-Item -Recurse -Force "public\$folder" "staticsite\$folder"
    }
}

# Optionally copy markdown content for reference
if (Test-Path content) {
    Copy-Item -Recurse -Force content staticsite\content
}

Write-Host "Static site assets copied. Check staticsite/ for results."
