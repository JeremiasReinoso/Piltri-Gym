const sessions = [
  { id: 1, title: "Fuerza Explosiva", trainer: "gustavo", day: 1, start: "07:00", end: "08:00", level: "Avanzado" },
  { id: 2, title: "Core + HIIT", trainer: "gustavo", day: 2, start: "18:00", end: "19:00", level: "Intermedio" },
  { id: 3, title: "Bootcamp", trainer: "gustavo", day: 4, start: "19:00", end: "20:00", level: "Todos" },
  { id: 4, title: "Functional Power", trainer: "gustavo", day: 6, start: "09:00", end: "10:00", level: "Intermedio" },
  { id: 5, title: "Hipertrofia Pro", trainer: "jonatan", day: 1, start: "09:00", end: "10:00", level: "Intermedio" },
  { id: 6, title: "Tecnica de Press", trainer: "jonatan", day: 3, start: "17:30", end: "18:30", level: "Todos" },
  { id: 7, title: "Piernas de Acero", trainer: "jonatan", day: 5, start: "18:30", end: "19:30", level: "Avanzado" },
  { id: 8, title: "Upper Body Focus", trainer: "jonatan", day: 6, start: "11:00", end: "12:00", level: "Intermedio" },
];

const names = {
  gustavo: "Gustavo",
  jonatan: "Jonatan",
};

const weekdayNames = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

const getMonday = (date) => {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

const formatDate = (date) =>
  date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
  });

const formatFullDate = (date) =>
  date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const setupModal = () => {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return null;

  const close = () => modal.classList.remove("is-open");
  modal.querySelectorAll("[data-modal-close]").forEach((trigger) => {
    trigger.addEventListener("click", close);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  const fill = (session, date) => {
    modal.querySelector("[data-modal-coach]").textContent = names[session.trainer];
    modal.querySelector("[data-modal-title]").textContent = session.title;
    modal.querySelector("[data-modal-time]").textContent = `${formatFullDate(date)} | ${session.start} - ${session.end}`;
    modal.querySelector("[data-modal-meta]").textContent = `Nivel: ${session.level}`;
    modal.classList.add("is-open");
  };

  return { fill };
};

const initCalendar = (root, modalCtrl) => {
  let weekOffset = 0;
  let activeFilter = root.dataset.defaultFilter || "all";

  const label = root.querySelector("[data-week-label]");
  const grid = root.querySelector("[data-calendar-grid]");
  const filters = root.querySelectorAll("[data-filter]");

  const render = (animate = false) => {
    if (animate) {
      grid.classList.add("is-switching");
      setTimeout(() => grid.classList.remove("is-switching"), 220);
    }

    const baseMonday = getMonday(new Date());
    const monday = addDays(baseMonday, weekOffset * 7);
    const sunday = addDays(monday, 6);
    label.textContent = `${formatDate(monday)} - ${formatDate(sunday)}`;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    grid.innerHTML = "";

    for (let day = 1; day <= 7; day += 1) {
      const date = addDays(monday, day - 1);
      const isToday = date.getTime() === today.getTime();
      const dayBox = document.createElement("article");
      dayBox.className = `calendar-day${isToday ? " is-today" : ""}`;
      dayBox.innerHTML = `<h4>${weekdayNames[day - 1]} ${formatDate(date)}</h4>`;

      const daySessions = sessions.filter(
        (item) => item.day === day && (activeFilter === "all" || item.trainer === activeFilter)
      );

      if (!daySessions.length) {
        const empty = document.createElement("p");
        empty.className = "calendar-empty";
        empty.textContent = "Sin clases";
        dayBox.appendChild(empty);
      } else {
        daySessions.forEach((session) => {
          const button = document.createElement("button");
          button.className = "calendar-event";
          button.type = "button";
          button.innerHTML = `<strong>${session.title}</strong><span>${session.start} - ${session.end}</span>`;
          button.addEventListener("click", () => modalCtrl?.fill(session, date));
          dayBox.appendChild(button);
        });
      }

      grid.appendChild(dayBox);
    }
  };

  root.querySelector('[data-action="prev-week"]')?.addEventListener("click", () => {
    weekOffset -= 1;
    render(true);
  });

  root.querySelector('[data-action="next-week"]')?.addEventListener("click", () => {
    weekOffset += 1;
    render(true);
  });

  filters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      activeFilter = filterButton.dataset.filter || "all";
      filters.forEach((button) => button.classList.remove("is-active"));
      filterButton.classList.add("is-active");
      render();
    });

    if (filterButton.dataset.filter === activeFilter) {
      filterButton.classList.add("is-active");
    }
  });

  render();
};

window.addEventListener("DOMContentLoaded", () => {
  const modalCtrl = setupModal();
  document.querySelectorAll("[data-calendar]").forEach((root) => initCalendar(root, modalCtrl));
});
