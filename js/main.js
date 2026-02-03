
// Alerta botón Telegram
document.addEventListener("DOMContentLoaded", () => {
    const telegramBtn = document.getElementById("telegramBtn");

    telegramBtn.addEventListener("click", () => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Esta página forma parte de un proyecto ficticio. No existe ningún canal de noticias en Telegram de PAUaPunto.",
        });
    });
});

// Fórmula matemática Bach
document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById("calcBtn");
    const result = document.getElementById("result");

    // Convertir a número
    function readNumber(id) {
        const el = document.getElementById(id);
        return Number(el.value);
    }

    // Comprobar que el valor está dentro del rango permitido
    function inRange(n, min, max) {
        return Number.isFinite(n) && n >= min && n <= max;
    }

    calcBtn.addEventListener("click", () => {
        const mb = readNumber('mb');
        const mfo = readNumber('mfo');
        const m1 = readNumber('m1');
        const m2 = readNumber('m2');
        const p1 = readNumber('p1');
        const p2 = readNumber('p2');

        // Validar notas introducidas
        const notasOk =
            inRange(mb, 0, 10) &&
            inRange(mfo, 0, 10) &&
            inRange(m1, 0, 10) &&
            inRange(m2, 0, 10);

        if (!notasOk) {
            result.value = "";
            Swal.fire({
                icon: "error",
                title: "Datos incorrectos",
                text: "Revisa MB, MFO, M1 y M2: deben ser números entre 0 y 10."
                });
            return;
        }

        const nota = (mb * 0.6 + mfo * 0.4) + (m1 * p1) + (m2 * p2);

        result.value = nota.toFixed(2);
    });
});

// Fórmula matemática FP
document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById("calcBtnFp");
    const result = document.getElementById("resultFp");

    function readNumber(id) {
        const el = document.getElementById(id);
        return Number(el.value);
    }

    function inRange(n, min, max) {
        return Number.isFinite(n) && n >= min && n <= max;
    }

    calcBtn.addEventListener("click", () => {
        const mfp = readNumber('mfp');
        const m1 = readNumber('m1fp');
        const m2 = readNumber('m2fp');
        const p1 = readNumber('p1fp');
        const p2 = readNumber('p2fp');

        const notasOk =
        inRange(mfp, 0, 10) &&
        inRange(m1, 0, 10) &&
        inRange(m2, 0, 10);

        if (!notasOk) {
        result.value = "";
        Swal.fire({
            icon: "error",
            title: "Datos incorrectos",
            text: "Revisa MFP, M1 y M2: deben ser números entre 0 y 10."
        });
        return;
        }

        const nota = mfp + (m1 * p1) + (m2 * p2);
        result.value = nota.toFixed(2);
    });
});






function initSiteSearch() {
  const form = $("siteSearchForm");
  const input = $("siteSearchInput");
  const modalEl = $("searchModal");
  const resultsEl = $("searchResults");
  const metaEl = $("searchMeta");

  // Si no existe el componente en esta página, no hacemos nada
  if (!form || !input || !modalEl || !resultsEl || !metaEl) return;
  if (typeof Fuse === "undefined" || typeof bootstrap === "undefined") return;

  // OJO: el nombre del archivo con acentos debe ser exacto
  const pages = ["index.html", "agenda.html", "Técnicas-herramientas.html"];

  let fuse = null;

  buildSiteIndex(pages)
    .then((items) => {
      fuse = new Fuse(items, {
        keys: ["title", "text"],
        includeScore: true,
        threshold: 0.35,
        ignoreLocation: true,
      });
    })
    .catch(() => {
      // Si falla (por ejemplo, en file://), no rompemos nada
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const q = (input.value || "").trim();
    if (!q) return;

    if (!fuse) {
      metaEl.textContent = "El buscador necesita ejecutarse en un servidor local (no file://).";
      resultsEl.innerHTML = "";
      new bootstrap.Modal(modalEl).show();
      return;
    }

    const res = fuse.search(q).slice(0, 12);
    metaEl.textContent = `${res.length} resultado(s) para: “${q}”`;

    resultsEl.innerHTML = res
      .map((r) => {
        const it = r.item;
        const subtitle = it.pageLabel
          ? `<div class="small text-secondary">${escHtml(it.pageLabel)}</div>`
          : "";
        return `
          <a class="list-group-item list-group-item-action" href="${escHtml(it.url)}">
            <div class="fw-semibold">${escHtml(it.title)}</div>
            ${subtitle}
          </a>
        `;
      })
      .join("");

    new bootstrap.Modal(modalEl).show();
  });
}

async function buildSiteIndex(pages) {
  const items = [];
  const parser = new DOMParser();

  for (const page of pages) {
    const res = await fetch(page, { cache: "no-store" });
    const html = await res.text();
    const doc = parser.parseFromString(html, "text/html");

    const pageTitle = (doc.querySelector("title")?.textContent || page).trim();

    // Indexa h1/h2/h3
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3"));
    for (const h of headings) {
      const title = (h.textContent || "").trim();
      if (!title) continue;

      // Preferimos enlazar a la section con id (si existe)
      const section = h.closest("section[id]");
      const id = section?.id || h.id || "";
      const url = id ? `${page}#${id}` : page;

      items.push({ title, text: title, url, pageLabel: pageTitle });
    }

    // Indexa títulos de cards (si hay)
    const cardTitles = Array.from(doc.querySelectorAll(".card-title"));
    for (const c of cardTitles) {
      const title = (c.textContent || "").trim();
      if (!title) continue;

      items.push({ title, text: title, url: page, pageLabel: pageTitle });
    }
  }

  // Quitar duplicados
  const uniq = new Map();
  for (const it of items) uniq.set(`${it.url}::${it.title}`, it);
  return Array.from(uniq.values());
}