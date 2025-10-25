
(function(){
  function init(){
    var overlay = document.getElementById('lightbox');
    var img = document.getElementById('lightbox-img');
    var closeBtn = document.getElementById('lightbox-close');
    var triggers = document.querySelectorAll('[data-lb-src]');
    if(!overlay || !(img instanceof HTMLImageElement) || !closeBtn || !triggers.length) return;
    var images = Array.from(triggers).map(function(el){ return el.getAttribute('data-lb-src'); });
    var currentIndex = -1;
    var prevBtn = document.getElementById('lightbox-prev');
    var nextBtn = document.getElementById('lightbox-next');

    function show(src){
      currentIndex = images.indexOf(src);
      img.src = src;
      overlay.classList.remove('hidden');
      overlay.style.display = 'block';
      // Scroll to top so the image is visible
      if (window.scrollTo) {
        window.scrollTo(0, 0);
      } else {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
      updateNav();
      document.addEventListener('keydown', onKey);
    }
    function hide(){
      overlay.classList.add('hidden');
      overlay.style.display = '';
      img.src = '';
      currentIndex = -1;
      document.removeEventListener('keydown', onKey);
    }
    function updateNav(){
      if (!prevBtn || !nextBtn) return;
      prevBtn.style.display = (currentIndex > 0) ? 'flex' : 'none';
      nextBtn.style.display = (currentIndex < images.length - 1 && currentIndex !== -1) ? 'flex' : 'none';
    }
    function showPrev(){
      if (currentIndex > 0) show(images[currentIndex - 1]);
    }
    function showNext(){
      if (currentIndex < images.length - 1) show(images[currentIndex + 1]);
    }
    function onKey(e){
      if(e.key === 'Escape') hide();
      if(e.key === 'ArrowLeft') showPrev();
      if(e.key === 'ArrowRight') showNext();
    }
    triggers.forEach(function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        var src = el.getAttribute('data-lb-src');
        if (src) show(src);
        e.stopPropagation();
      });
    });
    if (prevBtn) prevBtn.addEventListener('click', function(e){ e.stopPropagation(); showPrev(); });
    if (nextBtn) nextBtn.addEventListener('click', function(e){ e.stopPropagation(); showNext(); });
    overlay.addEventListener('click', function(e){
      // Only close if the click is directly on the overlay (not on image or controls)
      if (e.target === overlay) hide();
    });
    closeBtn.addEventListener('click', hide);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();