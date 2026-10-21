(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const videos = [...document.querySelectorAll('video')];
  const visibleVideos = new Set();
  let motionEnabled = !reducedMotion.matches;
  const updatePlayback = () => {
    videos.forEach(video => {
      if (motionEnabled && !document.hidden && visibleVideos.has(video)) {
        video.play().catch(() => {});
      } else video.pause();
    });
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) visibleVideos.add(entry.target); else visibleVideos.delete(entry.target); });
    updatePlayback();
  }, { threshold: 0.15 });
  videos.forEach(video => observer.observe(video));
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', event => { motionEnabled = !event.matches; updatePlayback(); });

  const comparison = document.querySelector('#gsssr-compare');
  let pointerOver = false;
  let referenceSelected = false;
  const updateComparison = () => {
    const showReference = pointerOver || referenceSelected;
    comparison.classList.toggle('show-reference', showReference);
    comparison.setAttribute('aria-pressed', String(showReference));
    comparison.setAttribute('aria-label', showReference ? 'Show edited image with SSR' : 'Show original reference image');
    comparison.querySelector('.compare-edited').setAttribute('aria-hidden', String(showReference));
    comparison.querySelector('.compare-original').setAttribute('aria-hidden', String(!showReference));
    document.querySelector('#gsssr-state').textContent = showReference ? 'Original · Reference' : 'Edited · With SSR';
  };
  comparison.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') { pointerOver = true; updateComparison(); }
  });
  comparison.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') { pointerOver = false; referenceSelected = false; updateComparison(); }
  });
  comparison.addEventListener('click', event => {
    if (event.detail === 0 || !pointerOver) { referenceSelected = !referenceSelected; updateComparison(); }
  });
  comparison.addEventListener('blur', () => { referenceSelected = false; updateComparison(); });
})();
