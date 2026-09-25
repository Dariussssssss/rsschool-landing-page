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
<article class="card">
<img src="./src/assets/img/menu/${p.category}/${p.image}" alt="${p.category}" class="card__img">
<p class="card__title">${p.name}</p>
<p class="card__text">${p.description}</p>
<p class="card__price">$${p.price}</p>
</article>
`).join('');
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {

    buttons.forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    const category = btn.dataset.category;
    renderCards(category);
  });
});

buttons[0].classList.add('active');
