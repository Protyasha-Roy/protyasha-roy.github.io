const blogFiles = [
  "../../blogs/we-are-still-dinosaurs.html",
  "../../blogs/never-say-never.html",
];

const ul = document.getElementById("blogs");
const searchInput = document.getElementById('search');
let metas = [];

// Utility to escape special regex chars
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

async function fetchMeta(path) {
  const res  = await fetch(path);
  const text = await res.text();
  const doc  = new DOMParser().parseFromString(text, "text/html");

  return {
    title: doc.querySelector('meta[name="title"]')?.content  || "Untitled",
    path,
  };
}

function renderItem({ title, path }) {
  const li = document.createElement("li");
  li.innerHTML = `
    <a class="blog-title" href="${path}"><div class="square"></div>${title}</a>
  `;
  return li;
}

function renderList(list, term = '') {
  ul.innerHTML = '';
  list.forEach(meta => {
    let displayedTitle = meta.title;
    if (term) {
      const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
      displayedTitle = displayedTitle.replace(
        regex,
        '<mark style="background:black; color:white;">$1</mark>'
      );
    }
    const item = renderItem({ ...meta, title: displayedTitle });
    ul.appendChild(item);
  });
}

(async function() {
  metas = await Promise.all(blogFiles.map(fetchMeta));

  // initial render
  renderList(metas);

  // live search filtering
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) {
      renderList(metas);
      return;
    }
    const filtered = metas.filter(meta =>
      meta.title.toLowerCase().includes(term)
    );
    renderList(filtered, term);
  });
})();