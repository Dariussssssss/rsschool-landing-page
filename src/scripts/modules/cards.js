const response = await fetch("./src/scripts/data/products.json");
const products = await response.json();
const container = document.querySelector('.menu__content');
const buttons = document.querySelectorAll('.buttons__filter');

export function renderCards(category) {
  const filtered = products.filter(p => p.category === category);

  if (filtered.length === 0) {
    container.innerHTML = '<p>Nothing found</p>';
    return;
  }

  container.innerHTML = filtered.map(p => `
<article class="menu-card">
<div class="img-wrapper"><img src="./src/assets/img/menu/${p.category}/${p.image}" alt="${p.category}" class="menu-card__img"></div>
<div class="menu-card__content">
<p class="menu-card__title card__title">${p.name}</p>
<p class="menu-card__text text-body">${p.description}</p>
<p class="menu-card__price card__title">$${p.price}</p>
</div>
</article>
`).join('');
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {

    buttons.forEach(b => b.classList.remove('active-category'));

    btn.classList.add('active-category');

    const category = btn.dataset.category;
    renderCards(category);
  });
});

buttons[0].classList.add('active-category');
