// latest-home-cards.js
// Dynamically updates the homepage latest uploads cards by tag
// Usage: <ul id="latest-home-cards"></ul>

window.latestCardsConfig = [
  { tag: 'projects', folder: 'uploads/projects/watch-2-0', link: 'projects/watch-2-0.html', title: 'ESP32 Watch 2.0', desc: 'A custom ESP32-based wearable watch with display, sensors, and wireless connectivity. Includes hardware, firmware, and enclosure design.', img: 'projects/watch-2-0/1000008110.jpg' },
  { tag: 'robotics', folder: 'robotics/actuator', link: 'projects/actuator.html', title: 'Robotic Actuator', desc: 'Precision linear actuator for robotics applications.', img: 'robotics/actuator/1000007864.jpg' },
  { tag: 'design', folder: 'design/thresh-lantern-display', link: 'design/thresh-lantern-display.html', title: 'Thresh Lantern Display', desc: 'A custom 3D-printed lantern with addressable LEDs and unique design.', img: 'design/thresh-lantern-display/1000007630 (1).jpg' },
  { tag: 'design', folder: 'design/jinx-display', link: 'design/jinx-display.html', title: 'Jinx Display', desc: 'A Fishbones-inspired display from League of Legends, 3D printable and ready for your shelf.', img: 'design/jinx-display/Fish Iso.JPG' },
  { tag: 'design', folder: 'design/red-rising-bookmark', link: 'design/red-rising-bookmark.html', title: 'Red Rising Bookmark', desc: 'A custom bookmark inspired by the Red Rising series, perfect for fans and readers.', img: 'design/red-rising-bookmark/Red_Rising_bookmark.png' },
  { tag: 'design', folder: 'design/viego-blade-of-the-ruined-king', link: 'design/viego-blade-of-the-ruined-king.html', title: 'Viego Blade of the Ruined King', desc: 'A 3D model of Viego’s sword from League of Legends, for cosplay or display.', img: 'design/viego-blade-of-the-ruined-king/1000007631 (1).jpg' },
  { tag: 'art', folder: 'uploads/art/sketch-1', link: 'art/sketch-1.html', title: 'Sketch 1', desc: 'A digital sketch exploring form and light.' },
  { tag: 'review', folder: 'uploads/reviews/book-one', link: 'reviews/book-one.html', title: 'Book One', desc: 'Notes on books with a scientific and philosophical bent.' },
  { tag: 'thoughts', folder: 'uploads/thoughts/first-note', link: 'thoughts/first-note.html', title: 'First Note', desc: 'A short reflection on science, tools, and meaning.' }
];

function getLatestImage(folder, imgOverride) {
  if (imgOverride) return imgOverride;
  // For static sites, manually list images or use the first found
  // In a dynamic site, fetch and sort by date
  const images = {
    'uploads/projects/watch-2-0': 'uploads/projects/watch-2-0/1000008110.jpg',
    'projects/watch-2-0': 'projects/watch-2-0/1000008110.jpg',
    // gripper intentionally removed
    'uploads/design/thresh-lantern-display': 'uploads/design/thresh-lantern-display/thumbnail.jpg',
    'uploads/art/sketch-1': 'uploads/art/sketch-1/sketch.jpg',
    'uploads/reviews/book-one': 'uploads/reviews/book-one/cover.jpg',
    'uploads/thoughts/first-note': 'uploads/thoughts/first-note/cover.jpg'
  };
  return images[folder] || '';
}

document.addEventListener('DOMContentLoaded', renderLatestHomeCards);
function renderCards(containerId, filterTag = null, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let cards = window.latestCardsConfig;
  if (filterTag) cards = cards.filter(card => card.tag === filterTag);
  if (limit) cards = cards.slice(0, limit);
  container.innerHTML = cards.map(card => `
    <li>
      <a href="${card.link}" class="card block">
        <div class="card-header">
          <span class="card-tag ${card.tag}">${card.tag}</span>
          <span class="card-date">${card.date || new Date().toISOString().slice(0, 10)}</span>
        </div>
        <div class="card-title">${card.title}</div>
        <img src="${getLatestImage(card.folder, card.img)}" alt="${card.title}" class="card-img" loading="lazy" />
        <div class="card-desc">${card.desc}</div>
      </a>
    </li>
  `).join('');
}

// For homepage
document.addEventListener('DOMContentLoaded', function() {
  renderCards('latest-home-cards');
});