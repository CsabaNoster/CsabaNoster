// latest-uploads.js
// Dynamically lists latest uploads for a given folder and tag
// Usage: <div id="latest-uploads" data-folder="downloads/eb15" data-limit="5"></div>

function fetchLatestUploads(folder, limit = 5) {
  // This function requires server-side support (API or directory listing)
  // For static sites, you must manually update the file list below
  // Example: List of files for eb15
  const files = [
    'downloads/eb15/Robotic Collaborative Robot Arm EB-15.stp',
    'downloads/eb15/EB15_Arm_STEPs.zip',
    'downloads/eb15/001.step',
    'downloads/eb15/002.step',
    'downloads/eb15/003.step',
    'downloads/eb15/005.step',
    'downloads/eb15/006.step',
    'downloads/eb15/007.step',
    'downloads/eb15/008,010.step',
    'downloads/eb15/Due_full_control.ino',
    'downloads/eb15/Mega_full_control.ino',
    'downloads/eb15/EB15_Placeholder.step'
  ];
  // Sort by assumed upload date (latest first)
  // If you have timestamps, sort by those
  return files.slice(0, limit);
}

function renderLatestUploads() {
  const container = document.getElementById('latest-uploads');
  if (!container) return;
  const folder = container.getAttribute('data-folder') || 'downloads/eb15';
  const limit = parseInt(container.getAttribute('data-limit') || '5', 10);
  const files = fetchLatestUploads(folder, limit);
  container.innerHTML = '<ul>' + files.map(f => `<li><a href="${f}" target="_blank">${f.split('/').pop()}</a></li>`).join('') + '</ul>';
}

document.addEventListener('DOMContentLoaded', renderLatestUploads);