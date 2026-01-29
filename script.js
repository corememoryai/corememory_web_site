// script.js

(function () {
  emailjs.init("bRVi2dWDB_yEMqqoa");
})();

// ---------- Mobile nav toggle ----------
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector(".nav__menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu after clicking a link (mobile)
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Close menu when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    if (!isMobile) return;

    const clickedInside = menu.contains(e.target) || toggle.contains(e.target);
    if (!clickedInside && menu.classList.contains("is-open")) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ---------- Reveal animations ----------
const animated = document.querySelectorAll("[data-animate]");

const revealNow = (el) => el.classList.add("is-in");
const revealAll = () => animated.forEach(revealNow);

if ("IntersectionObserver" in window && animated.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animated.forEach((el) => io.observe(el));
} else {
  revealAll();
}

// ---------- Active nav link on scroll ----------
const navLinks = Array.from(document.querySelectorAll(".nav__link"));
const idsToTrack = ["problem", "how", "features", "usecases", "demo"];
const sections = idsToTrack
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setActiveLink(activeId) {
  navLinks.forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle("is-active", href === `#${activeId}`);
  });
}

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const io2 = new IntersectionObserver(
    (entries) => {
      // pick the most visible intersecting section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActiveLink(visible.target.id);
    },
    // helps highlight section earlier while scrolling
    { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.2, 0.4] }
  );

  sections.forEach((s) => io2.observe(s));
}

// ---------- Smooth scroll (fallback for older browsers) ----------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ---------- Demo form: simple submit + toast ----------

const form = document.querySelector(".cta__form");
const toast = document.querySelector(".toast");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (toast) {
      toast.textContent = "Sending your request...";
      toast.style.opacity = "1";
    }

    emailjs
      .sendForm(
        "service_s5lf4bk",
        "template_ucewe8p",
        form
      )
      .then(
        function () {
          if (toast) {
            toast.textContent =
              "✅ Thanks! Your demo request has been sent successfully.";
          }
          form.reset();
        },
        function (error) {
          console.error("EmailJS Error:", error);
          if (toast) {
            toast.textContent =
              "❌ Something went wrong. Please try again later.";
          }
        }
      );
  });
}
