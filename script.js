/*
  ============================================================
  DAILY MATERIAL CONFIGURATION
  ============================================================
  Add one object for every new PDF.

  Example:
  {
    date: "2026-10-06",
    file: "pdfs/2026-10-06.pdf"
  }

  IMPORTANT:
  - Date format MUST be YYYY-MM-DD.
  - PDF path is relative to index.html.
  - Put the actual PDF inside the pdfs folder.
  ============================================================
*/

const studyMaterial = [
  // Example:
  { date: "2026-10-05", file: "pdfs/2026-10-05.pdf" },
  { date: "2026-10-06", file: "pdfs/2026-10-06.pdf" },
  //{ date: "2026-10-07", file: "pdfs/2026-10-07.pdf" },
  //{ date: "2026-10-08", file: "pdfs/2026-10-08.pdf" },
  //{ date: "2026-10-09", file: "pdfs/2026-10-09.pdf" },
  //{ date: "2026-10-10", file: "pdfs/2026-10-10.pdf" },
  //{ date: "2026-10-11", file: "pdfs/2026-10-11.pdf" },
  //{ date: "2026-10-12", file: "pdfs/2026-10-12.pdf" },



];

const grid = document.getElementById("dateGrid");
const search = document.getElementById("searchInput");
const empty = document.getElementById("emptyState");
const count = document.getElementById("materialCount");
const todayBtn = document.getElementById("todayBtn");
const themeToggle = document.getElementById("themeToggle");

document.getElementById("year").textContent = new Date().getFullYear();

function formatDate(dateString) {
  const d = new Date(dateString + "T00:00:00");
  return {
    day: d.toLocaleDateString("en-IN", { weekday: "long" }),
    date: d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}

function render(filter = "") {
  const query = filter.trim().toLowerCase();

  const sorted = [...studyMaterial].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const filtered = sorted.filter(item => {
    const info = formatDate(item.date);
    return (
      item.date.toLowerCase().includes(query) ||
      info.day.toLowerCase().includes(query) ||
      info.date.toLowerCase().includes(query)
    );
  });

  grid.innerHTML = "";

  count.textContent =
    `${studyMaterial.length} ${studyMaterial.length === 1 ? "day" : "days"} available`;

  empty.classList.toggle("hidden", filtered.length !== 0);

  filtered.forEach(item => {
    const info = formatDate(item.date);

    const card = document.createElement("a");
    card.className = "date-card";
    card.href = item.file;
    card.target = "_blank";
    card.rel = "noopener";

    card.innerHTML = `
      <div class="card-top">
        <div class="calendar">📅</div>
        <div class="pdf-label">PDF</div>
      </div>
      <div class="day">${info.day}</div>
      <div class="full-date">${info.date}</div>
      <div class="open-text">Open today's material →</div>
    `;

    grid.appendChild(card);
  });
}

search.addEventListener("input", () => render(search.value));

todayBtn.addEventListener("click", () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayString = `${yyyy}-${mm}-${dd}`;

  search.value = todayString;
  render(todayString);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀" : "☾";
  localStorage.setItem("studyPortalTheme", isDark ? "dark" : "light");
});

if (localStorage.getItem("studyPortalTheme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀";
}

render();
