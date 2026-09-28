export function initBurgerMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  const header = document.querySelector('.header');
  const setHeaderHeight = () => {
    if (header) {
      document.documentElement.style.setProperty(
        '--header-height',
        `${header.offsetHeight}px`
      );
    }
  };
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  const openMenu = () => {
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  menu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });


  window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) closeMenu();
  });
}
