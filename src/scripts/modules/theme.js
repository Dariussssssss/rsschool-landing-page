const STORAGE_KEY = 'theme';


function getInitialTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) return savedTheme;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getTheme(theme) {
  document.body.classList.toggle('dark-theme', theme === 'dark');
  document.body.classList.toggle('light-theme', theme === 'light');
  localStorage.setItem(STORAGE_KEY, theme);
}

export function initTheme() {
  getTheme(getInitialTheme());

  document.querySelector('.theme-toggle--light')
    .addEventListener('click', () => getTheme('light'));

  document.querySelector('.theme-toggle--dark')
    .addEventListener('click', () => getTheme('dark'));
}

