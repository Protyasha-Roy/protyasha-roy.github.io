const blogFiles = [
  "../../blogs/blog-1.html",
];

const ul = document.getElementById("blogs");
const searchInput = document.getElementById('search');
let metas = [];

async function fetchMeta(path) {
  const res  = await fetch(path);
  const text = await res.text();
  const doc  = new DOMParser().parseFromString(text, "text/html");

  return {
    rawTitle: doc.querySelector('meta[name="title"]')?.content || "Untitled",
    path,
  };
}

function renderItem({ title, path }) {
  const li = document.createElement("li");
  li.innerHTML = `
    <a class="blog-title" href="${path}">
      <div class="square"></div>
      ${title}
    </a>
  `;
  return li;
}

function renderList(list) {
  ul.innerHTML = '';
  list.forEach(meta => {
    ul.appendChild(renderItem({ title: meta.rawTitle, path: meta.path }));
  });
}

(async function() {
  metas = await Promise.all(blogFiles.map(fetchMeta));

  renderList(metas);

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const filteredMetas = metas.filter(meta =>
      meta.rawTitle.toLowerCase().includes(term)
    );
    renderList(filteredMetas);
  });
})();