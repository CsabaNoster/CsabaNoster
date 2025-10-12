(function(){
  function init(){
    var overlay = document.getElementById('lightbox');
    var imgEl = document.getElementById('lightbox-img');
    var closeBtn = document.getElementById('lightbox-close');
    var triggers = document.querySelectorAll('[data-lb-src]');
    if(!overlay || !(imgEl instanceof HTMLImageElement) || !closeBtn || !triggers.length) return;
    var img = imgEl;
    function show(src){
      try { console.debug('[LB] show', src); } catch {}
      img.src = src;
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      document.addEventListener('keydown', onKey);
    }
    function hide(){
      try { console.debug('[LB] hide'); } catch {}
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
      img.src = '';
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e){ if(e.key === 'Escape') hide(); }
    triggers.forEach(function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        var src = el.getAttribute('data-lb-src');
        if (src) show(src);
        e.stopPropagation();
      });
    });
    document.addEventListener('click', function(e){
      if (!overlay.classList.contains('flex')) return;
      var t = e.target;
      if (!(t instanceof Node)) return;
      if (!img.contains(t)) hide();
    });
    overlay.addEventListener('click', function(e){
      var t = e.target;
      if (!(t instanceof Node)) return;
      if (!img.contains(t)) hide();
    });
    closeBtn.addEventListener('click', hide);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();