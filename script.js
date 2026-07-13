/* PartnerGuru — interactions */
(function () {
  "use strict";

  // Sticky header style on scroll
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  var backdrop = document.getElementById("navBackdrop");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) backdrop.classList.toggle("show", open);
    document.body.classList.toggle("menu-open", open);
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });
    if (backdrop) backdrop.addEventListener("click", function () { setMenu(false); });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Contact form -> submitted to Web3Forms, which emails the owner. Works on any static host.
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.textContent : "";
      var oldErr = form.querySelector(".form-error");
      if (oldErr) oldErr.remove();
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch("https://api.web3forms.com/submit", { method: "POST", body: new FormData(form) })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data.success) throw new Error("submit failed");
          form.innerHTML =
            '<div class="form-success" role="status">' +
            "<h3>Thank you — your message is on its way.</h3>" +
            "<p>I’ll get back to you personally, and with discretion.</p>" +
            "</div>";
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = original; }
          var note = document.createElement("p");
          note.className = "form-error";
          note.setAttribute("role", "alert");
          note.textContent = "Sorry — something went wrong sending your message. Please try again in a moment.";
          form.appendChild(note);
        });
    });
  }

  // Hide the sticky mobile CTA once the contact section is in view
  var mobileCta = document.getElementById("mobileCta");
  var contact = document.getElementById("contact");
  if (mobileCta && contact && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        mobileCta.style.opacity = e.isIntersecting ? "0" : "1";
        mobileCta.style.pointerEvents = e.isIntersecting ? "none" : "auto";
      });
    }, { threshold: 0.15 });
    cio.observe(contact);
  }

  // Current year in footer
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
