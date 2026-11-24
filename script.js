(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation: tap to open; close after choosing a section or pressing Escape.
  const menuToggle = $('.menu-toggle');
  const primaryNav = $('#primary-nav');
  const setMenu = (open) => {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    primaryNav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open && window.innerWidth <= 760);
  };
  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  $$('.primary-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) setMenu(false); });

  // Active navigation state based on the section currently in view.
  const navLinks = $$('.nav-link');
  const navSections = navLinks.map(link => $(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -60% 0px', threshold: 0 });
    navSections.forEach(section => observer.observe(section));
  }

  // Reading progress bar.
  const progress = $('#reading-progress-bar');
  let progressTicking = false;
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    progressTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!progressTicking) {
      window.requestAnimationFrame(updateProgress);
      progressTicking = true;
    }
  }, { passive: true });
  updateProgress();

  // Market-data explainer tabs.
  const flowContent = [
    { title: 'Publisher workflows', copy: 'Configure and set up market-data publisher workflows in TREP / ADS environments to support the distribution of real-time feeds.', tags: ['Publisher configuration', 'Feed setup'] },
    { title: 'TREP / ADS environment', copy: 'Work around the publisher and distribution environment, its configuration and the infrastructure dependencies involved in moving real-time market data.', tags: ['TREP', 'ADS', 'Distribution workflows'] },
    { title: 'Downstream applications', copy: 'Applications consume L1 top-of-book quotes and L2 market depth for downstream equities and electronic-trading workflows.', tags: ['L1 · Top of book', 'L2 · Market depth', 'Consumers'] }
  ];
  const flowButtons = $$('.flow-step');
  const flowPanel = $('#flow-panel');
  const renderFlow = index => {
    const item = flowContent[index];
    if (!item) return;
    flowButtons.forEach((button, i) => {
      const active = i === index;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    flowPanel?.setAttribute('aria-labelledby', `flow-tab-${index + 1}`);
    $('#flow-title').textContent = item.title;
    $('#flow-copy').textContent = item.copy;
    $('#flow-tags').replaceChildren(...item.tags.map(tag => {
      const span = document.createElement('span'); span.textContent = tag; return span;
    }));
  };
  renderFlow(0);
  flowButtons.forEach((button, index) => {
    button.addEventListener('click', () => renderFlow(index));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index + flowButtons.length - 1) % flowButtons.length;
      if (event.key === 'ArrowRight') next = (index + 1) % flowButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = flowButtons.length - 1;
      flowButtons[next].focus(); renderFlow(next);
    });
  });

  // Filter projects; cards remain a native horizontal swipe rail on touch screens.
  const filterButtons = $$('.filter-button');
  const projectCards = $$('.project-card');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projectCards.forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
      const rail = $('#project-rail');
      if (rail) rail.scrollTo({ left: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  });
  const rail = $('#project-rail');
  $$('[data-carousel]').forEach(button => button.addEventListener('click', () => {
    if (!rail) return;
    const firstVisible = $('.project-card:not([hidden])', rail);
    const cardWidth = firstVisible ? firstVisible.getBoundingClientRect().width + 16 : 320;
    rail.scrollBy({ left: button.dataset.carousel === 'next' ? cardWidth : -cardWidth, behavior: 'smooth' });
  }));

  // Skills explorer: accessible tab interaction.
  const skillSets = [
    { kicker: 'LANGUAGES & RUNTIME', title: 'Java & backend engineering', copy: 'Core Java and runtime fundamentals used to build, debug and improve backend applications.', chips: ['Core Java', 'OOP', 'Collections Framework', 'Multithreading', 'Concurrency', 'JVM internals', 'Garbage collection', 'JVM tuning', 'Runtime profiling', 'Code-level debugging', 'Spring Boot · foundational', 'Python', 'SQL', 'Bash / Shell', 'Perl'] },
    { kicker: 'CAPITAL MARKETS', title: 'Trading systems', copy: 'Working knowledge and hands-on exposure across equities trading workflows, OMS and exchange connectivity.', chips: ['Order Management Systems', 'Equities trading', 'Order lifecycle', 'Electronic trading', 'DMA workflows', 'Algorithmic trading · exposure', 'FIX Protocol', 'Binary market protocols', 'Exchange connectivity', 'Client integration'] },
    { kicker: 'REAL-TIME FEEDS', title: 'Market data systems', copy: 'Experience with L1 and L2 data consumption and publisher workflow setup in TREP / ADS environments.', chips: ['L1 market data', 'L2 market data', 'Top-of-book quotes', 'Market depth', 'Real-time feeds', 'TREP', 'ADS', 'Data publishers', 'Publisher workflow setup', 'Market data distribution', 'Downstream consumers', 'Market data integration'] },
    { kicker: 'RUNTIME & OPERATIONS', title: 'Infrastructure & reliability', copy: 'Production engineering across Linux environments, network troubleshooting and application diagnostics.', chips: ['Linux', 'Unix', 'Windows', 'TCP/IP', 'Wireshark', 'Process monitoring', 'System troubleshooting', 'Performance diagnostics', 'L3 production support', 'Incident management', 'Root cause analysis', 'Log analysis', 'High availability', 'Network troubleshooting'] },
    { kicker: 'DELIVERY & PRODUCTIVITY', title: 'Tools, messaging & AI-assisted development', copy: 'Build and delivery tooling, project exposure to messaging technologies, and AI coding assistants used in everyday engineering workflows.', chips: ['Git', 'Jenkins', 'Maven', 'CI/CD', 'IntelliJ IDEA', 'Postman', 'Jira', 'Confluence', 'ServiceNow', 'SQL', 'MySQL', 'PostgreSQL', 'Oracle SQL', 'Solace · project exposure', 'TIBCO decommissioning', 'Claude Code', 'GitLab Duo', 'GitHub Copilot'] }
  ];
  const skillTabs = $$('.skill-tab');
  const renderSkills = index => {
    const item = skillSets[index];
    if (!item) return;
    skillTabs.forEach((button, i) => {
      const active = i === index;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    $('#skill-panel').setAttribute('aria-labelledby', `skill-tab-${index}`);
    $('#skill-kicker').textContent = item.kicker;
    $('#skill-title').textContent = item.title;
    $('#skill-copy').textContent = item.copy;
    $('#skill-chips').replaceChildren(...item.chips.map(chip => {
      const span = document.createElement('span'); span.textContent = chip; return span;
    }));
  };
  renderSkills(0);
  skillTabs.forEach((button, index) => {
    button.addEventListener('click', () => renderSkills(index));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index + skillTabs.length - 1) % skillTabs.length;
      if (event.key === 'ArrowRight') next = (index + 1) % skillTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = skillTabs.length - 1;
      skillTabs[next].focus(); renderSkills(next);
    });
  });

  // Copy email with a fallback for browsers without Clipboard API.
  const copyButton = $('.copy-email');
  const toast = $('.toast');
  let toastTimer;
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1900);
  };
  copyButton?.addEventListener('click', async () => {
    const email = copyButton.dataset.copy;
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        showToast('Email address copied');
      } else {
        window.location.href = `mailto:${email}`;
        showToast('Opening your email app');
      }
    } catch (_) {
      window.location.href = `mailto:${email}`;
    }
  });
})();
