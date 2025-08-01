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
    renderCards(data.results);
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
      <img src="${character.image}" alt="${character.name}"
        class="w-32 h-32 object-cover rounded-full mb-4 border-4 border-green-500 hover:scale-105 transition-transform" />
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
    video.pause(); // O puedes dejarlo reproduciendo si no deseas detenerlo
  }
});
