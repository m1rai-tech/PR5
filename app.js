const routes = {
  catalog: 'Каталог',
  details: 'Про альбом',
  feedback: 'Відгуки',
};

const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-link');

function render() {
  const hash = window.location.hash.slice(1);
  const route = hash in routes ? hash : 'catalog';

  views.forEach((view) => {
    view.classList.toggle('is-hidden', view.id !== route);
  });

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${route}`;
    link.classList.toggle('is-active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  document.title = `${routes[route]} — VasyaPlayer`;
}

window.addEventListener('hashchange', render);
render();

const timerValue = document.querySelector('.timer-value');
let seconds = 0;

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(Math.floor(total % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

window.setInterval(() => {
  seconds += 1;
  timerValue.textContent = formatTime(seconds);
}, 1000);

const audio = document.querySelector('audio');
const rows = document.querySelectorAll('.tracks tbody tr');
const nowTitle = document.querySelector('.now-title');
const nowCover = document.querySelector('.now-cover');
const tiCover = document.querySelector('.ti-cover');
const tiTitle = document.querySelector('.ti-title');
const tiGenre = document.querySelector('.ti-genre');
const tiBpm = document.querySelector('.ti-bpm');
const tiYear = document.querySelector('.ti-year');

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');

    const title = row.querySelector('.title').textContent;

    audio.src = row.dataset.src;
    nowTitle.textContent = title;
    nowCover.src = row.querySelector('img').src;
    tiTitle.textContent = title;
    tiCover.src = row.querySelector('img').src;
    tiGenre.textContent = row.dataset.genre;
    tiBpm.textContent = row.dataset.bpm;
    tiYear.textContent = row.dataset.year;
    audio.play();
  });

  const meta = new Audio();
  meta.preload = 'metadata';
  meta.addEventListener('loadedmetadata', () => {
    row.querySelector('.time').textContent = formatTime(meta.duration);
  });
  meta.src = row.dataset.src;
});

const form = document.querySelector('.review-form');
const nameInput = document.querySelector('#name');
const textInput = document.querySelector('#text');
const list = document.querySelector('.review-list');
const reviewsCount = document.querySelector('.reviews-count');

function setError(input, message) {
  input.parentElement.querySelector('.error').textContent = message;
  input.classList.toggle('invalid', message !== '');
}

[nameInput, textInput].forEach((input) => {
  input.addEventListener('input', () => setError(input, ''));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const text = textInput.value.trim();
  setError(nameInput, name.length < 2 ? "Ім'я має містити мінімум 2 символи" : '');
  setError(textInput, text.length < 10 ? 'Відгук має містити мінімум 10 символів' : '');
  if (name.length < 2 || text.length < 10) return;

  const item = document.createElement('li');
  item.classList.add('review');
  const author = document.createElement('p');
  author.classList.add('review-author');
  author.textContent = name;
  const body = document.createElement('p');
  body.textContent = text;
  item.append(author, body);
  list.prepend(item);

  reviewsCount.textContent = list.children.length;
  form.reset();
});
