const blogFiles = [
  "../../blogs/we-are-still-dinosaurs.html",
  "../../blogs/never-say-never.html",
];

const ul = document.getElementById("blogs");

async function fetchMeta(path) {
  const res  = await fetch(path);
  const text = await res.text();
  const doc  = new DOMParser().parseFromString(text, "text/html");

  return {
    title: doc.querySelector('meta[name="title"]')?.content  || "Untitled",
    date:  doc.querySelector('meta[name="date"]')?.content   || "",
    tags:  (doc.querySelector('meta[name="tags"]')?.content || "")
              .split(",")
              .map(t => t.trim())
              .filter(Boolean),
    path,
  };
}

function renderItem({ title, date, tags, path }) {
  const li = document.createElement("li");
  li.innerHTML =`
  <div class="blog-meta">
  <time datetime="${date}">${new Date(date).toLocaleDateString()}</time>
  <div>
  ${tags.map(t => `<span>${t}</span>`).join(" ")}
  </div>
  </div>
  <a class="blog-title" href="${path}">${title}</a>
  `;
  return li;
}

(async function() {
  const metas = await Promise.all(blogFiles.map(fetchMeta));

  metas.sort((a, b) => new Date(b.date) - new Date(a.date));

  metas.forEach(meta => {
    ul.appendChild(renderItem(meta));
  });
})();
