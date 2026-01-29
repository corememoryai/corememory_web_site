// ---------- EmailJS init ----------
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

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// ---------- Demo form: submit + toast + email ----------
const form = document.querySelector(".cta__form");
const toast = document.querySelector(".toast");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    emailjs
      .send(
        "service_s5lf4bk",      // ✅ SERVICE ID 
        "template_ucewe8p",     // ✅ TEMPLATE ID
        {
          name: form.name.value,
          title: form.title.value,
          email: form.email.value,
          company: form.company.value,
          size: form.size.value,
        }
      )
      .then(() => {
        if (toast) {
          toast.textContent =
            "Thanks! We’ll reach out shortly to schedule your demo.";
          toast.style.opacity = "1";
        }

        form.reset();

        setTimeout(() => {
          if (toast) toast.textContent = "";
        }, 4000);
      })
      .catch((error) => {
        console.error("EmailJS ERROR:", error);
        alert("Mail gönderilemedi. Konsolu kontrol et.");
      });
  });
}
