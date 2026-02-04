
//-----> Alerta botón Telegram
document.addEventListener("DOMContentLoaded", () => {
    const telegramBtn = document.getElementById("telegramBtn");

    if (telegramBtn) {
      telegramBtn.addEventListener("click", () => {
          Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Esta página forma parte de un proyecto ficticio. No existe ningún canal de noticias en Telegram de PAUaPunto.",
          });
      });
    }
});

//-----> Fórmula matemática Bach
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

  if (calcBtn) {
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
  }
});

//-----> Fórmula matemática FP
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



//-----> Buscador con fusejs y json
document.addEventListener("DOMContentLoaded", () => {
  initSiteSearch(); //Se llama cuando acaba de cargar el DOM
});

function initSiteSearch() {
  const form = document.getElementById("siteSearchForm");
  const input = document.getElementById("siteSearchInput");
  const modalEl = document.getElementById("searchModal");
  const resultsEl = document.getElementById("searchResults");
  const metaEl = document.getElementById("searchMeta");

  // El programa no hace nada si el elemento no existe
  if (!form || !input || !modalEl || !resultsEl || !metaEl) return;

  // Variable para guardar el fuse (vacío)
  let fuse = null;

  // Cargar el JSON
  fetch("buscador.json")
    .then((respuesta) => respuesta.json()) // convertir el resultado JSON a obj/array JS
    .then((data) => { // data: contenido JSON ya convertido (array)

      // Crear Fuse con esos datos
      fuse = new Fuse(data, {
        keys: ["title"],
        threshold: 0.3 // Para la tolerancia de coincidencias aprox de las búsquedas
      });
    });

  // Capturar el submit del buscador
  form.addEventListener("submit", (event) => { // e: event
    event.preventDefault(); // Para evitar que el formulario recargue la página

    const query = input.value.trim(); // Trim es para quitar espacios (buscador)
    if (!query || !fuse) return; // Si no se busca nada o no se cargó el json, no se busca

    // Buscar
    const results = fuse.search(query).slice(0, 10); // Slice era para cortar arrays: mostrar los 10 primeros resultados

    // Mostrar nº resultados
    metaEl.textContent = `${results.length} resultado(s) para "${query}"`; 

    // 
    resultsEl.innerHTML = ""; // limpiar

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      const link = document.createElement("a");
      link.href = result.item.url;
      link.textContent = result.item.title;
      link.className = "list-group-item list-group-item-action";

      resultsEl.appendChild(link);
    }

    // Abrir modal
    new bootstrap.Modal(modalEl).show();
  });
}
