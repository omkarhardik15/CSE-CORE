"use strict";

// Add a new dated PDF here.
// Paths are relative to index.html.
const studyMaterial = [
  { date: "2026-10-05", file: "pdfs/2026-10-05.pdf" },
  { date: "2026-10-06", file: "pdfs/2026-10-06.pdf" },

  // { date: "2026-10-07", file: "pdfs/2026-10-07.pdf" },
  // { date: "2026-10-08", file: "pdfs/2026-10-08.pdf" },
  // { date: "2026-10-09", file: "pdfs/2026-10-09.pdf" },
  // { date: "2026-10-10", file: "pdfs/2026-10-10.pdf" },
  // { date: "2026-10-12", file: "pdfs/2026-10-12.pdf" }
];


// ==============================
// DOM ELEMENTS
// ==============================

const grid = document.getElementById("dateGrid");
const search = document.getElementById("searchInput");
const empty = document.getElementById("emptyState");
const count = document.getElementById("materialCount");
const clear = document.getElementById("clearBtn");


// ==============================
// SVG ICONS
// ==============================

const calendarSVG = `
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="3"
      stroke="currentColor"
      stroke-width="1.8"
    />
    <path
      d="M8 3v4m8-4v4M3 10h18"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    />
  </svg>
`;

const arrowSVG = `
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M7 17 17 7M9 7h8v8"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;


// ==============================
// DATE FORMATTING
// ==============================

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);

  return {
    day: date.toLocaleDateString("en-IN", {
      weekday: "long"
    }),

    full: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }),

    month: date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric"
    }),

    number: date.toLocaleDateString("en-IN", {
      day: "2-digit"
    })
  };
}


// ==============================
// RENDER STUDY MATERIAL
// ==============================

function render(filter = "") {
  grid.replaceChildren();

  const sorted = [...studyMaterial].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const items = sorted.filter(
    (item) => !filter || item.date === filter
  );

  // Update count
  count.textContent =
    items.length +
    (items.length === 1
      ? " day available"
      : " days available");

  // Empty state and clear button
  empty.hidden = items.length !== 0;
  clear.hidden = !filter;

  let month = "";
  let cards;

  items.forEach((item) => {
    const info = formatDate(item.date);

    // Create new month section
    if (info.month !== month) {
      month = info.month;

      const section = document.createElement("section");

      const title = document.createElement("h3");
      title.className = "month-heading";
      title.textContent = month;

      cards = document.createElement("div");
      cards.className = "cards";

      section.append(title, cards);
      grid.append(section);
    }

    // ==========================
    // Create Study Material Card
    // ==========================

    const card = document.createElement("a");

    card.className = "card";
    card.href = item.file;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    card.setAttribute(
      "aria-label",
      `Open study material for ${info.full}`
    );

    // Card top
    const top = document.createElement("div");
    top.className = "card-top";

    top.innerHTML = `
      <span class="icon">
        ${calendarSVG}
      </span>

      <span class="pdf">
        PDF
      </span>
    `;

    // Card text
    const text = document.createElement("div");

    const day = document.createElement("p");
    day.className = "day";
    day.textContent = info.day;

    const date = document.createElement("p");
    date.className = "full-date";
    date.textContent = info.full;

    text.append(day, date);

    // Card bottom
    const bottom = document.createElement("div");
    bottom.className = "card-bottom";

    bottom.innerHTML = `
      <span>Open study material</span>
      ${arrowSVG}
    `;

    // Assemble card
    card.append(top, text, bottom);

    cards.append(card);
  });
}


// ==============================
// CLEAR FILTER
// ==============================

function clearFilter() {
  search.value = "";
  render();
}


// ==============================
// SEARCH / FILTER FORM
// ==============================

document
  .getElementById("filterForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    render(search.value);
  });


// ==============================
// TODAY BUTTON
// ==============================

document
  .getElementById("todayBtn")
  .addEventListener("click", () => {
    const now = new Date();

    const local =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");

    search.value = local;

    render(local);
  });


// ==============================
// CLEAR BUTTONS
// ==============================

clear.addEventListener("click", clearFilter);

document
  .getElementById("emptyClear")
  .addEventListener("click", clearFilter);


// ==============================
// FOOTER YEAR
// ==============================

document.getElementById("year").textContent =
  new Date().getFullYear();


// ==============================
// LATEST STUDY MATERIAL
// ==============================

const latest = [...studyMaterial].sort((a, b) =>
  b.date.localeCompare(a.date)
)[0];

if (latest) {
  const info = formatDate(latest.date);

  // Preview information
  document.getElementById("previewMonth").textContent =
    info.month;

  document.getElementById("previewDay").textContent =
    info.number;

  document.getElementById("previewWeekday").textContent =
    info.day;

  // View latest PDF
  const viewLink = document.getElementById("latestLink");

  viewLink.href = latest.file;
  viewLink.hidden = false;

  // Download latest PDF
  const downloadLink =
    document.getElementById("latestDownload");

  downloadLink.href = latest.file;
  downloadLink.download = `${latest.date}.pdf`;
  downloadLink.hidden = false;
}


// ==============================
// INITIAL RENDER
// ==============================

render();
