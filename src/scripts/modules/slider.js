const response = await fetch("./src/scripts/data/slider.json");
const sliders = await response.json();

const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const sliderViewport = document.querySelector('.slider__viewport');
const sliderTrack = document.querySelector('.slider__track');
const sliderRoot = document.querySelector('.favorite-coffee__wrapper');

const autoplayTimeout = 7000;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let currentIndex = 0;
let autoplay = null;
let autoplayStartTime = 0;
let autoplayRemaining = 0;
let isPaused = false;

export function renderSlider() {
  sliderTrack.innerHTML = sliders.map(e => `
    <li class="slider__slide">
      <article class="card">
        <img src="./src/assets/img/index/slider/${e.image}" alt="${e.name}" class="card__img">
        <p class="card__title">${e.name}</p>
        <p class="card__text text-body">${e.description}</p>
        <p class="card__price card__title">$${e.price}</p>
      </article>
    </li>
  `).join("");
}

function updateSlider() {
  sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

  document.querySelectorAll('.slider__control').forEach((c, i) => {
    c.classList.toggle('slider__control--active', i === currentIndex);
  });

  restartProgressAnimation();
}

function restartProgressAnimation() {
  const activeProgress = document.querySelector('.slider__control--active .slider__progress');
  if (!activeProgress) return;

  activeProgress.style.animation = 'none';
  void activeProgress.offsetWidth;
  activeProgress.style.animation = '';
  void activeProgress.offsetWidth;
}

function next() {
  currentIndex = (currentIndex + 1) % sliders.length;
  updateSlider();
}

function prev() {
  currentIndex = (currentIndex - 1 + sliders.length) % sliders.length;
  updateSlider();
}

function startTimer(delay) {
  autoplayStartTime = performance.now() - (autoplayTimeout - delay);

  autoplay = setTimeout(() => {
    autoplay = null;
    autoplayRemaining = 0;
    next();
    autoplayStartTime = performance.now();
    startTimer(autoplayTimeout);
  }, delay);
}

function startAutoplay() {
  if (autoplay) return;
  if (prefersReducedMotion) return;
  if (isPaused) return;

  const delay = autoplayRemaining > 0 ? autoplayRemaining : autoplayTimeout;
  autoplayRemaining = 0;

  startTimer(delay);
  sliderRoot?.classList.remove('slider--paused');
}

function stopAutoplay() {
  sliderRoot?.classList.add('slider--paused');

  if (!autoplay) return;

  clearTimeout(autoplay);
  autoplay = null;

  const elapsed = performance.now() - autoplayStartTime;
  autoplayRemaining = Math.max(0, autoplayTimeout - elapsed);
}

function resetAutoplay() {
  if (autoplay) {
    clearTimeout(autoplay);
    autoplay = null;
  }
  autoplayRemaining = 0;
  autoplayStartTime = performance.now();

  restartProgressAnimation();
  startAutoplay();
}

function handleUserAction(callback) {
  stopAutoplay();
  callback();
  resetAutoplay();
}

export function initSliderControls() {
  if (!sliderViewport || !sliderRoot) return;

  sliderRoot.style.setProperty('--autoplay-delay', `${autoplayTimeout}ms`);

  prevBtn?.addEventListener('click', () => handleUserAction(prev));
  nextBtn?.addEventListener('click', () => handleUserAction(next));

  document.querySelectorAll('.slider__control').forEach((control, i) => {
    control.addEventListener('click', () => {
      handleUserAction(() => {
        currentIndex = i;
        updateSlider();
      });
    });
  });

  sliderViewport.addEventListener('mouseenter', () => {
    isPaused = true;
    stopAutoplay();
  });

  sliderViewport.addEventListener('mouseleave', () => {
    isPaused = false;
    sliderRoot.classList.remove('slider--paused');
    startAutoplay();
  });

  initSwipe();
  initMouseSwipe();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      autoplayRemaining = 0;
      sliderRoot.classList.remove('slider--paused');
      restartProgressAnimation();
      startAutoplay();
    }
  });

  updateSlider();
  startAutoplay();
}

function initSwipe() {
  let startX = 0;
  let startY = 0;
  let isSwiping = false;
  const swipeX = 50;
  const swipeY = 1.5;

  sliderViewport.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    isSwiping = false;
    stopAutoplay();
  }, {passive: true});

  sliderViewport.addEventListener('touchmove', (e) => {
    if (!startX || !startY) return;

    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - startX);
    const dy = Math.abs(touch.clientY - startY);

    if (dy > dx * swipeY) {
      isSwiping = false;
      return;
    }

    isSwiping = true;
  }, {passive: true});

  sliderViewport.addEventListener('touchend', (e) => {
    if (!isSwiping) {
      startAutoplay();
      return;
    }

    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;

    if (Math.abs(dx) < swipeX) {
      startAutoplay();
      return;
    }

    if (dx < 0) next();
    else prev();

    resetAutoplay();
  });

  sliderViewport.addEventListener('touchcancel', () => {
    startAutoplay();
  });
}

function initMouseSwipe() {
  let startX = 0;
  let isDown = false;
  const swipeX = 50;

  sliderViewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('a, button, input, textarea, select')) return;
    startX = e.clientX;
    isDown = true;
    e.preventDefault();
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDown) return;
    isDown = false;

    const dx = e.clientX - startX;
    if (Math.abs(dx) < swipeX) return;

    if (dx < 0) next();
    else prev();

    resetAutoplay();
  });
}
