// Simple popup script for art gallery
(function(){
  function init(){
    var triggers = document.querySelectorAll('[data-popup-src]');
    if (!triggers.length) return;
    // Create overlay and popup image
    var overlay = document.createElement('div');
    overlay.id = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.85)';
    overlay.style.zIndex = '2147483647';
    overlay.style.display = 'none';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'flex-start';
    overlay.style.overflow = 'auto';
    overlay.style.backdropFilter = 'blur(2px)';

    var img = document.createElement('img');
    img.id = 'popup-img';
    img.style.position = 'absolute';
    img.style.left = '50%';
    img.style.top = '2cm';
    img.style.transform = 'translateX(-50%)';
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '80vh';
    img.style.borderRadius = '0.5rem';
    img.style.boxShadow = '0 2px 16px #0008';
    img.style.background = '#181818';
    img.style.border = '4px solid #fff';
    overlay.appendChild(img);

    // Close on overlay click
    overlay.addEventListener('click', function(e){
      if (e.target === overlay) hide();
    });
    // Close on Esc
    function onKey(e){
      if (e.key === 'Escape') hide();
    }
    function show(src) {
      img.src = src;
      overlay.style.display = 'block';
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
    }
    function hide() {
      overlay.style.display = 'none';
      img.src = '';
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
    document.body.appendChild(overlay);
    triggers.forEach(function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        var src = el.getAttribute('data-popup-src');
        if (src) show(src);
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
