(() => {
  const root = document.documentElement;
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  navToggle?.addEventListener('click', () => {
    const open = navList?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(!!open));
  });

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      hero.style.perspective = '800px';
      hero.querySelector('.hero-content')?.setAttribute('style', `transform: rotateY(${x*6}deg) rotateX(${-y*6}deg)`);
    });
    hero.addEventListener('mouseleave', () => {
      hero.querySelector('.hero-content')?.setAttribute('style', 'transform: none');
    });
  }

  const grid = document.getElementById('projectsGrid');
  const search = document.getElementById('search');
  const chips = document.querySelectorAll('.chip');
  let activeTag = 'all';

  function applyFilters() {
    if (!grid) return;
    const q = (search?.value || '').toLowerCase();
    grid.querySelectorAll('.card').forEach((el) => {
      const title = el.querySelector('.card-title')?.textContent?.toLowerCase() || '';
      const tags = (el.getAttribute('data-tags') || '').split(',');
      const matchText = !q || title.includes(q);
      const matchTag = activeTag === 'all' || tags.includes(activeTag);
      el.style.display = matchText && matchTag ? '' : 'none';
    });
  }
  search?.addEventListener('input', applyFilters);
  chips.forEach((c) => c.addEventListener('click', () => {
    chips.forEach((x) => x.classList.remove('active'));
    c.classList.add('active');
    activeTag = c.getAttribute('data-tag') || 'all';
    applyFilters();
  }));

  const title = document.getElementById('projectTitle');
  const sub = document.getElementById('projectSub');
  const desc = document.getElementById('projectDesc');
  const mainMedia = document.getElementById('mainMedia');
  const prev = document.getElementById('prevProject');
  const next = document.getElementById('nextProject');
  const thumbs = document.getElementById('thumbs');
  if (title && mainMedia && prev && next) {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id') || '1');
    const metaById = {
      1: {
        title: 'E-Commerce Landing & Customer UI',
        desc: 'Responsive landing page and customer-facing interface designed for an online gift shop system.',
      },
      2: {
        title: 'Frontend Development – Code Architecture',
        desc: 'Structured HTML, CSS, and JavaScript code focused on clean layout and scalable components.',
      },
      3: {
        title: 'Authentication & Admin Dashboard System',
        desc: 'Role-based system with login authentication and interfaces for staff and administrators.',
      },
    };
    const meta = metaById[id];
    if (meta) {
      title.textContent = meta.title;
      sub.textContent = `Case study #${id}`;
      desc.textContent = meta.desc;
    } else {
      title.textContent = `Project ${id}`;
      sub.textContent = `Case study #${id}`;
      desc.textContent = `Breakdown of Project ${id}. Placeholder data.`;
    }
    const galleryById = {
      1: [
        'Screenshot 2025-11-25 110255.png',
        'Screenshot 2025-11-25 110336.png',
        'Screenshot 2025-11-25 110544.png',
        'Screenshot 2025-11-25 110644.png',
      ],
      2: [
        'Screenshot 2025-11-25 111636.png',
        'Screenshot 2025-11-25 111744.png',
        'Screenshot 2025-11-25 111808.png',
        'Screenshot 2025-11-25 111820.png',
      ],
      3: [
        'Screenshot 2025-11-25 112504.png',
        'Screenshot 2025-11-25 112543.png',
        'Screenshot 2025-11-25 112722.png',
        'Screenshot 2025-11-25 112758.png',
      ],
    };
    const gallery = galleryById[id] || [];
    const unique = Array.from(new Set(gallery));
    if (unique.length) {
      mainMedia.src = unique[0];
      if (thumbs) {
        const thumbsList = unique.slice(1);
        thumbs.innerHTML = thumbsList
          .map((src, i) => `<img src="${src}" alt="Project ${id} image ${i+2}" loading="lazy">`)
          .join('');
      }
    } else {
      mainMedia.src = 'assets/img/placeholder.svg';
    }
    prev.href = `project.html?id=${id > 1 ? id-1 : 6}`;
    next.href = `project.html?id=${id < 6 ? id+1 : 1}`;
    thumbs?.querySelectorAll('img').forEach((img) => {
      img.addEventListener('click', () => { openLightbox(img.src); });
    });
    function openLightbox(src) {
      const overlay = document.createElement('div');
      overlay.className = 'lightbox';
      const img = document.createElement('img');
      img.src = src;
      overlay.appendChild(img);
      const onKey = (e) => {
        if (e.key === 'Escape') { document.removeEventListener('keydown', onKey); overlay.remove(); }
      };
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(overlay);
    }
    mainMedia.addEventListener('click', () => openLightbox(mainMedia.src));
  }
})();