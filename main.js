// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

if (localStorage.getItem("theme") === "dark") {
  root.classList.add("dark");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// Rick and Morty API
// Rick and Morty API
const container = document.getElementById("characters-container");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

const statusFilter = document.getElementById("statusFilter");
const speciesFilter = document.getElementById("speciesFilter");
const genderFilter = document.getElementById("genderFilter");

let currentPage = 1;

async function fetchCharacters(page = 1) {
  const name = searchInput.value.trim();
  const status = statusFilter.value;
  const species = speciesFilter.value;
  const gender = genderFilter.value;

  const url = `https://rickandmortyapi.com/api/character?page=${page}${
    name ? `&name=${name}` : ""
  }${status ? `&status=${status}` : ""}${species ? `&species=${species}` : ""}${
    gender ? `&gender=${gender}` : ""
  }`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    renderCards(data.results.slice(0, 8)); // ✅ Solo muestra 8 personajes
    updateButtons(data.info);
  } catch (error) {
    container.innerHTML = `<p class="text-center w-full col-span-full text-red-400">No se encontraron resultados.</p>`;
    prevButton.disabled = true;
    nextButton.disabled = true;
  }
}

function renderCards(characters) {
  container.innerHTML = "";
  characters.forEach((character) => {
    const card = document.createElement("div");
    card.className =
      "bg-gray-100 text-black dark:bg-gray-800 dark:text-white p-4 rounded-xl shadow-md dark:shadow-[#4a648b] transition-all hover:shadow-green-500 flex flex-col items-center text-center cursor-pointer hover:scale-110";

    card.innerHTML = `
      <img src="${character.image}" alt="${character.name}" class="w-32 h-32 object-cover rounded-full mb-4 border-4 border-green-500 hover:scale-105 transition-transform" />
      <h3 class="text-xl font-bold mb-1">${character.name}</h3>
      <p class="text-sm text-gray-700 dark:text-gray-300">${character.species} - ${character.status}</p>
    `;

    container.appendChild(card);
  });
}

function updateButtons(info) {
  prevButton.disabled = !info.prev;
  nextButton.disabled = !info.next;
}

searchButton.addEventListener("click", () => {
  currentPage = 1;
  fetchCharacters(currentPage);
});

prevButton.addEventListener("click", () => {
  currentPage--;
  fetchCharacters(currentPage);
});

nextButton.addEventListener("click", () => {
  currentPage++;
  fetchCharacters(currentPage);
});

[statusFilter, speciesFilter, genderFilter].forEach((filter) =>
  filter.addEventListener("change", () => {
    currentPage = 1;
    fetchCharacters(currentPage);
  })
);

// Inicializar la página
fetchCharacters(currentPage);

// video
const video = document.getElementById("videoFondo");

video.addEventListener("click", () => {
  if (video.paused) {
    video.muted = false;
    video.play();
  } else {
    video.pause();
  }
});

// LOCACION

let residentList = [];
let residentIndex = 0;
const residentsPageSize = 8;

async function getLocations() {
  try {
    const res = await fetch("https://rickandmortyapi.com/api/location");
    const data = await res.json();
    renderLocationCards(data.results);
  } catch (error) {
    console.error("Error al cargar locaciones:", error);
  }
}

function renderLocationCards(locations) {
  const container = document.getElementById("location-container");
  container.innerHTML = "";

  locations.forEach((location) => {
    const card = document.createElement("div");
    card.className =
      "bg-gray-100 text-black dark:bg-gray-800 dark:text-white p-4 rounded-xl shadow-md transition dark:shadow-[#4a648b] hover:shadow-green-500 flex flex-col items-center text-center cursor-pointer hover:scale-110";

    const name = document.createElement("h3");
    name.textContent = location.name;
    name.className = "text-lg font-semibold mb-2";

    const type = document.createElement("p");
    type.textContent = `Tipo: ${location.type}`;
    type.className = "text-sm mb-1";

    const dimension = document.createElement("p");
    dimension.textContent = `Dimensión: ${location.dimension}`;
    dimension.className = "text-sm";

    card.appendChild(name);
    card.appendChild(type);
    card.appendChild(dimension);

    card.addEventListener("click", () => openLocationModal(location));

    container.appendChild(card);
  });
}

async function openLocationModal(location) {
  document.getElementById(
    "modal-location-name"
  ).textContent = `Nombre: ${location.name}`;
  document.getElementById(
    "modal-location-type"
  ).textContent = `Tipo: ${location.type}`;
  document.getElementById(
    "modal-location-dimension"
  ).textContent = `Dimensión: ${location.dimension}`;

  residentList = location.residents;
  residentIndex = 0;

  renderResidentPage();

  document.getElementById("location-modal").classList.remove("hidden");
}

async function renderResidentPage() {
  const container = document.getElementById("modal-location-residents");
  container.innerHTML = "";

  const slice = residentList.slice(
    residentIndex,
    residentIndex + residentsPageSize
  );
  const promises = slice.map((url) => fetch(url).then((res) => res.json()));

  try {
    const residents = await Promise.all(promises);

    residents.forEach((char) => {
      const wrapper = document.createElement("div");
      wrapper.className = "flex flex-col items-center text-center";

      const img = document.createElement("img");
      img.src = char.image;
      img.alt = char.name;
      img.className = "w-20 h-20 rounded-full mb-2 shadow-md";

      const name = document.createElement("p");
      name.textContent = char.name;
      name.className = "text-sm";

      wrapper.appendChild(img);
      wrapper.appendChild(name);
      container.appendChild(wrapper);
    });
  } catch (error) {
    console.error("Error al cargar residentes:", error);
  }

  document.getElementById("prev-residents").disabled = residentIndex === 0;
  document.getElementById("next-residents").disabled =
    residentIndex + residentsPageSize >= residentList.length;
}

document.getElementById("prev-residents").addEventListener("click", () => {
  if (residentIndex - residentsPageSize >= 0) {
    residentIndex -= residentsPageSize;
    renderResidentPage();
  }
});

document.getElementById("next-residents").addEventListener("click", () => {
  if (residentIndex + residentsPageSize < residentList.length) {
    residentIndex += residentsPageSize;
    renderResidentPage();
  }
});

document
  .getElementById("close-location-modal")
  .addEventListener("click", () => {
    document.getElementById("location-modal").classList.add("hidden");
    residentList = [];
  });

document.addEventListener("DOMContentLoaded", getLocations);

// EPISODIOS
let characterList = [];
let currentIndex = 0;
const pageSize = 8;

async function getEpisodes() {
  try {
    const res = await fetch("https://rickandmortyapi.com/api/episode");
    const data = await res.json();
    renderEpisodeCards(data.results);
  } catch (error) {
    console.error("Error al cargar episodios:", error);
  }
}

function renderEpisodeCards(episodes) {
  const container = document.getElementById("episode-container");
  container.innerHTML = "";

  episodes.forEach((episode) => {
    const card = document.createElement("div");
    card.className =
      "bg-gray-100 text-black dark:bg-gray-800 dark:text-white p-4 rounded-xl dark:shadow-[#4a648b] shadow-md transition hover:shadow-green-500 flex flex-col items-center text-center cursor-pointer hover:scale-110";

    const idText = document.createElement("h3");
    idText.textContent = `Episodio: ${episode.name}`;
    idText.className = "text-lg font-semibold mb-2";

    const code = document.createElement("p");
    code.textContent = `Código: ${episode.episode}`;
    code.className = "text-sm mb-1";

    const airDate = document.createElement("p");
    airDate.textContent = `Emitido: ${episode.air_date}`;
    airDate.className = "text-sm";

    card.appendChild(idText);
    card.appendChild(code);
    card.appendChild(airDate);

    card.addEventListener("click", () => openEpisodeModal(episode));

    container.appendChild(card);
  });
}

async function openEpisodeModal(episode) {
  document.getElementById(
    "modal-episode-name"
  ).textContent = `Nombre: ${episode.name}`;
  document.getElementById(
    "modal-episode-code"
  ).textContent = `Código: ${episode.episode}`;
  document.getElementById(
    "modal-episode-air-date"
  ).textContent = `Fecha: ${episode.air_date}`;

  characterList = episode.characters;
  currentIndex = 0;
  renderCharacterPage();

  document.getElementById("episode-modal").classList.remove("hidden");
}

async function renderCharacterPage() {
  const container = document.getElementById("modal-episode-characters");
  container.innerHTML = "";

  const slice = characterList.slice(currentIndex, currentIndex + pageSize);
  const promises = slice.map((url) => fetch(url).then((res) => res.json()));

  try {
    const characters = await Promise.all(promises);

    characters.forEach((char) => {
      const wrapper = document.createElement("div");
      wrapper.className = "flex flex-col items-center text-center";

      const img = document.createElement("img");
      img.src = char.image;
      img.alt = char.name;
      img.className = "w-20 h-20 rounded-full mb-2 shadow-md";

      const name = document.createElement("p");
      name.textContent = char.name;
      name.className = "text-sm";

      wrapper.appendChild(img);
      wrapper.appendChild(name);
      container.appendChild(wrapper);
    });
  } catch (error) {
    console.error("Error al cargar personajes:", error);
  }

  document.getElementById("prev-characters").disabled = currentIndex === 0;
  document.getElementById("next-characters").disabled =
    currentIndex + pageSize >= characterList.length;
}

document.getElementById("prev-characters").addEventListener("click", () => {
  if (currentIndex - pageSize >= 0) {
    currentIndex -= pageSize;
    renderCharacterPage();
  }
});

document.getElementById("next-characters").addEventListener("click", () => {
  if (currentIndex + pageSize < characterList.length) {
    currentIndex += pageSize;
    renderCharacterPage();
  }
});

document.getElementById("close-episode-modal").addEventListener("click", () => {
  document.getElementById("episode-modal").classList.add("hidden");
  characterList = [];
});

document.addEventListener("DOMContentLoaded", getEpisodes);

fetch("https://rickandmortyapi.com/api/episode")
  .then((res) => res.json())
  .then((data) => console.log(data.results));
