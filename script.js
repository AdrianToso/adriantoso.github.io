(() => {
  'use strict';
  const controls = document.querySelector('.certificate-tools');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.certificate-card')];
  const count = document.querySelector('.certificate-count');

  if (controls && count && buttons.length && cards.length) {
    for (const button of buttons) {
      button.addEventListener('click', () => {
        const selected = button.dataset.filter;
        let visible = 0;
        for (const card of cards) {
          card.hidden = selected !== 'todos' && card.dataset.category !== selected;
          if (!card.hidden) visible += 1;
        }
        for (const option of buttons) {
          option.setAttribute('aria-pressed', String(option === button));
        }
        count.textContent = `${visible} ${visible === 1 ? 'certificado' : 'certificados'}${selected === 'todos' ? '' : ` · ${button.textContent}`}`;
      });
    }
    controls.hidden = false;
  }

  const navigation = [...document.querySelectorAll('nav a[href^="#"]')];
  const header = document.querySelector('.site-header');
  const sections = navigation.map(link => ({link, section: document.querySelector(link.getAttribute('href'))})).filter(item => item.section);
  let scheduled = false;
  const updateNavigation = () => {
    const offset = (header?.getBoundingClientRect().height || 0) + 90;
    let active = null;
    for (const item of sections) {
      if (item.section.getBoundingClientRect().top <= offset) active = item;
    }
    for (const item of sections) {
      if (item === active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    }
    scheduled = false;
  };
  const schedule = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateNavigation);
    }
  };
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule, {passive: true});
  updateNavigation();
})();
