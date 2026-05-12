const ROME_TIMEZONE = "Europe/Rome";

const OPENING_SCHEDULE = [
  { day: 1, label: "Lunedì", open: "12:00", close: "19:30" },
  { day: 2, label: "Martedì", open: "12:00", close: "19:30" },
  { day: 3, label: "Mercoledì", open: "12:00", close: "19:30" },
  { day: 4, label: "Giovedì", open: "12:00", close: "19:30" },
  { day: 5, label: "Venerdì", open: "12:00", close: "19:30" }
];

const WEEKDAY_MAP = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getRomeTime(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: ROME_TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });

  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));

  return {
    day: WEEKDAY_MAP[parts.weekday],
    minutes: Number(parts.hour) * 60 + Number(parts.minute)
  };
}

function getNextOpening(currentDay, currentMinutes) {
  for (let offset = 0; offset < 8; offset += 1) {
    const day = (currentDay + offset) % 7;
    const slot = OPENING_SCHEDULE.find((entry) => entry.day === day);

    if (!slot) {
      continue;
    }

    const openMinutes = toMinutes(slot.open);
    if (offset > 0 || currentMinutes < openMinutes) {
      return { ...slot, offset };
    }
  }

  return null;
}

function buildStatus() {
  const { day, minutes } = getRomeTime();
  const today = OPENING_SCHEDULE.find((entry) => entry.day === day);

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);

    if (minutes >= open && minutes < close) {
      return {
        open: true,
        label: "Aperto ora",
        detail: `Oggi fino alle ${today.close}.`
      };
    }
  }

  const next = getNextOpening(day, minutes);
  const nextText = next ? `${next.offset === 0 ? "oggi" : next.label} alle ${next.open}` : "al prossimo turno";

  return {
    open: false,
    label: "Chiuso ora",
    detail: `Riapre ${nextText}.`
  };
}

function updateOpenStatus() {
  const status = buildStatus();
  const badges = document.querySelectorAll("[data-open-status]");
  const details = document.querySelectorAll("[data-status-detail]");

  badges.forEach((badge) => {
    badge.textContent = status.label;
    badge.classList.toggle("is-open", status.open);
    badge.classList.toggle("is-closed", !status.open);
  });

  details.forEach((detail) => {
    detail.textContent = status.detail;
  });
}

function initNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (!toggle || !menu) {
    return;
  }

  const closeMenu = () => {
    document.body.classList.remove("is-nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("is-nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function initHeaderState() {
  const header = document.querySelector("[data-site-header]");

  if (!header) {
    return;
  }

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  elements.forEach((element) => observer.observe(element));
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initHeaderState();
  initReveal();
  updateOpenStatus();
  window.setInterval(updateOpenStatus, 60000);
});
