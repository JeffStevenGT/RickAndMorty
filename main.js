const contenedor = document.querySelector("#characters-container");
const prevBtn = document.querySelector("#prevButton");
const nextBtn = document.querySelector("#nextButton");
const searchBtn = document.querySelector("#searchButton");
const searchInput = document.querySelector("#searchInput");
const filterOption = document.querySelector("#filterOption"); // Asegúrate de tener este <select> en tu HTML

let currentPage = 1;
let currentSearch = "";
let currentFilterTipo = ""; // Especio
let currentFilterValor = ""; // Estado

async function obtenerPersonajes(pagina = 1, nombre = "", filtroTipo = "", filtroValor = "") {
  try {
    let url = `https://rickandmortyapi.com/api/character/?page=${pagina}`;

    if (nombre) {
      const nombreCodificado = nombre.replace(/ /g, "%20"); /*"%20" es el código que representa un espacio en url.*/ 
      url += `&name=${nombreCodificado}`;
    }

    if (filtroTipo && filtroValor) {
      const filtroValorCodificado = filtroValor.replace(/ /g, "%20");
      url += `&${filtroTipo}=${filtroValorCodificado}`;
    }

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      contenedor.innerHTML = `<p class="text-red-500">No se encontraron personajes.</p>`;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    const datos = await respuesta.json();
    mostrarPersonajes(datos.results);

    prevBtn.disabled = !datos.info.prev;
    nextBtn.disabled = !datos.info.next;

  } catch (error) {
    contenedor.innerHTML = `<p class="text-red-500">Error al conectar con la API.</p>`;
    console.error(error);
  }
}

function mostrarPersonajes(personajes) {
  contenedor.innerHTML = "";

  personajes.forEach(personaje => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "bg-gray-800 rounded-xl shadow-lg overflow-hidden";

    tarjeta.innerHTML = `
      <img src="${personaje.image}" alt="${personaje.name}" class="w-full h-56 object-cover">
      <div class="p-4 space-y-2">
        <h2 class="text-xl font-semibold">${personaje.name}</h2>
        <p><span class="font-bold">Estado:</span> ${personaje.status}</p>
        <p><span class="font-bold">Especie:</span> ${personaje.species}</p>
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });
}

// Eventos
nextBtn.addEventListener("click", () => {
  currentPage++;
  obtenerPersonajes(currentPage, currentSearch, currentFilterTipo, currentFilterValor);
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    obtenerPersonajes(currentPage, currentSearch, currentFilterTipo, currentFilterValor);
  }
});

searchBtn.addEventListener("click", () => {
  currentSearch = searchInput.value.trim();
  const filtroSeleccionado = filterOption.value;

  let filtroTipo = "";
  let filtroValor = "";

  if (filtroSeleccionado.includes(":")) {
    [filtroTipo, filtroValor] = filtroSeleccionado.split(":");
  }

  currentFilterTipo = filtroTipo;
  currentFilterValor = filtroValor;
  currentPage = 1;

  obtenerPersonajes(currentPage, currentSearch, filtroTipo, filtroValor);
});

// Buscar también con Enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Inicial
obtenerPersonajes();
