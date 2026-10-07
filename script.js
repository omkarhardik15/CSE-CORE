"use strict";

// Add a new dated PDF here.
// Paths are relative to index.html.
const studyMaterial = [
  { date: "2026-10-05", file: "pdfs/2026-10-05.pdf" },
  { date: "2026-10-06", file: "pdfs/2026-10-06.pdf" },
  { date: "2026-10-07", file: "pdfs/2026-10-07.pdf" },
  // { date: "2026-10-08", file: "pdfs/2026-10-08.pdf" },
  // { date: "2026-10-09", file: "pdfs/2026-10-09.pdf" },
  // { date: "2026-10-10", file: "pdfs/2026-10-10.pdf" },
  // { date: "2026-10-12", file: "pdfs/2026-10-12.pdf" }
];

const grid = document.getElementById("dateGrid");
const search = document.getElementById("searchInput");
const empty = document.getElementById("emptyState");
const count = document.getElementById("materialCount");
const clear = document.getElementById("clearBtn");

const calendarSVG =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
  '<rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/>' +
  '<path d="M8 3v4m8-4v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
  "</svg>";

const arrowSVG =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
  '<path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
  "</svg>";

function formatDate(value) {
  const d = new Date(value + "T00:00:00");

  return {
    day: d.toLocaleDateString("en-IN", {
      weekday: "long"
    }),

    full: d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }),

    month: d.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric"
    }),

    number: d.toLocaleDateString("en-IN", {
      day: "2-digit"
    })
  };
}


// --------------------------------------------------
// DOWNLOAD PDF
// --------------------------------------------------

async function downloadPDF(file, filename) {
  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error("PDF could not be downloaded.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);

    // Fallback
    const link = document.createElement("a");
    link.href = file;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}


// --------------------------------------------------
// RENDER MATERIAL
// --------------------------------------------------

function render(filter = "") {
  grid.replaceChildren();

  const sorted = [...studyMaterial].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const items = sorted.filter(
    item => !filter || item.date === filter
  );

  count.textContent =
    items.length +
    (items.length === 1 ? " day available" : " days available");

  empty.hidden = items.length !== 0;
  clear.hidden = !filter;

  let month = "";
  let cards;

  items.forEach(item => {
    const info = formatDate(item.date);

    // Create month section
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


    // Card
    const card = document.createElement("div");
    card.className = "card";


    // Top
    const top = document.createElement("div");
    top.className = "card-top";

    top.innerHTML =
      '<span class="icon">' +
      calendarSVG +
      '</span>' +
      '<span class="pdf">PDF</span>';


    // Text
    const text = document.createElement("div");

    const day = document.createElement("p");
    day.className = "day";
    day.textContent = info.day;

    const date = document.createElement("p");
    date.className = "full-date";
    date.textContent = info.full;

    text.append(day, date);


    // Bottom buttons
    const bottom = document.createElement("div");
    bottom.className = "card-bottom";


    // View PDF button
    const viewBtn = document.createElement("a");

    viewBtn.href = item.file;
    viewBtn.target = "_blank";
    viewBtn.rel = "noopener noreferrer";
    viewBtn.textContent = "View PDF";
    viewBtn.setAttribute(
      "aria-label",
      "View study material for " + info.full
    );


    // Download button
    const downloadBtn = document.createElement("a");

    downloadBtn.href = item.file;
    downloadBtn.download = `${item.date}.pdf`;
    downloadBtn.textContent = "Download";
    downloadBtn.href = item.file;

    downloadBtn.setAttribute(
      "aria-label",
      "Download study material for " + info.full
    );

    downloadBtn.addEventListener("click", event => {
      event.preventDefault();

      downloadPDF(
        item.file,
        `${item.date}.pdf`
      );
    });


    bottom.append(viewBtn, downloadBtn);

    card.append(
      top,
      text,
      bottom
    );

    cards.append(card);
  });
}


// --------------------------------------------------
// CLEAR FILTER
// --------------------------------------------------

function clearFilter() {
  search.value = "";
  render();
}


// --------------------------------------------------
// SEARCH
// --------------------------------------------------

document
  .getElementById("filterForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    render(search.value);
  });


// --------------------------------------------------
// TODAY BUTTON
// --------------------------------------------------

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


// --------------------------------------------------
// CLEAR BUTTONS
// --------------------------------------------------

clear.addEventListener(
  "click",
  clearFilter
);

document
  .getElementById("emptyClear")
  .addEventListener(
    "click",
    clearFilter
  );


// --------------------------------------------------
// FOOTER YEAR
// --------------------------------------------------

document.getElementById("year").textContent =
  new Date().getFullYear();


// --------------------------------------------------
// LATEST MATERIAL
// --------------------------------------------------

const latest = [...studyMaterial]
  .sort((a, b) =>
    b.date.localeCompare(a.date)
  )[0];


if (latest) {
  const info = formatDate(latest.date);

  document.getElementById(
    "previewMonth"
  ).textContent = info.month;

  document.getElementById(
    "previewDay"
  ).textContent = info.number;

  document.getElementById(
    "previewWeekday"
  ).textContent = info.day;


  // View latest PDF
  const viewLink =
    document.getElementById("latestLink");

  viewLink.href = latest.file;
  viewLink.hidden = false;


  // Download latest PDF
  const downloadLink =
    document.getElementById("latestDownload");

  downloadLink.href = latest.file;
  downloadLink.download = `${latest.date}.pdf`;
  downloadLink.hidden = false;

  downloadLink.addEventListener(
    "click",
    event => {
      event.preventDefault();

      downloadPDF(
        latest.file,
        `${latest.date}.pdf`
      );
    }
  );
}


// --------------------------------------------------
// INITIAL RENDER
// --------------------------------------------------

render();
