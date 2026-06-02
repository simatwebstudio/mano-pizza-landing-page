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

function formatClock(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
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
  const time = formatClock(minutes);

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);

    if (minutes >= open && minutes < close) {
      return {
        open: true,
        label: "Aperto ora",
        detail: `Oggi fino alle ${today.close}.`,
        time
      };
    }
  }

  const next = getNextOpening(day, minutes);
  const nextText = next ? `${next.offset === 0 ? "oggi" : next.label} alle ${next.open}` : "al prossimo turno";

  return {
    open: false,
    label: "Chiuso ora",
    detail: `Riapre ${nextText}.`,
    time
  };
}

function updateOpenStatus() {
  const status = buildStatus();
  const cards = document.querySelectorAll("[data-status-card]");
  const badges = document.querySelectorAll("[data-open-status]");
  const details = document.querySelectorAll("[data-status-detail]");
  const times = document.querySelectorAll("[data-status-time]");

  cards.forEach((card) => {
    card.classList.toggle("is-open", status.open);
    card.classList.toggle("is-closed", !status.open);
    card.setAttribute("aria-label", `${status.label}. ${status.detail}`);
  });

  badges.forEach((badge) => {
    badge.textContent = status.label;
    badge.classList.toggle("is-open", status.open);
    badge.classList.toggle("is-closed", !status.open);
  });

  details.forEach((detail) => {
    detail.textContent = status.detail;
  });

  times.forEach((time) => {
    time.textContent = status.time;
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

function initLegalLanguage() {
  const buttons = document.querySelectorAll("[data-lang-button]");
  const panels = Array.from(document.querySelectorAll("[data-lang-panel]")).filter((panel) => !panel.closest(".site-header"));

  if (!buttons.length || !panels.length) {
    return;
  }

  const getHashLanguage = () => (window.location.hash === "#privacy-en" ? "en" : "it");

  const setLanguage = (language, updateHash = false) => {
    const activeLanguage = language === "en" ? "en" : "it";

    document.documentElement.lang = activeLanguage;
    document.body.dataset.legalLang = activeLanguage;

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.langPanel !== activeLanguage;
    });

    buttons.forEach((button) => {
      const isActive = button.dataset.langButton === activeLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (updateHash) {
      const nextHash = `#privacy-${activeLanguage}`;
      if (window.location.hash !== nextHash) {
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
      }
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.langButton, true);
    });
  });

  window.addEventListener("hashchange", () => {
    setLanguage(getHashLanguage());
  });

  setLanguage(getHashLanguage());
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initHeaderState();
  initReveal();
  initLegalLanguage();
  updateOpenStatus();
  window.setInterval(updateOpenStatus, 60000);
});
