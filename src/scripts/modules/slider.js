const response = await fetch("./src/scripts/data/slider.json");
const sliders = await response.json();
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const sliderTrack = document.querySelector('.slider__track');

let currentIndex = 0;

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
}

export function initSliderControls() {
  if (!prevBtn || !nextBtn) return;

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + sliders.length) % sliders.length;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % sliders.length;
    updateSlider();
  });
}
