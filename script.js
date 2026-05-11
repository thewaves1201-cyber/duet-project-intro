(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var navPanel = document.getElementById("nav-panel");
  var navLinks = navPanel ? navPanel.querySelectorAll('a[href^="#"]') : [];
  var slides = document.querySelectorAll(".snap-slide");

  function setHeaderScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  function closeNav() {
    if (!navToggle || !navPanel) return;
    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!navToggle || !navPanel) return;
    navPanel.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function toggleNav() {
    if (!navPanel) return;
    if (navPanel.classList.contains("is-open")) closeNav();
    else openNav();
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", toggleNav);
    navPanel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 1099px)").matches) closeNav();
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  window.addEventListener("scroll", setHeaderScrolled, { passive: true });
  setHeaderScrolled();

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* 앵커: scroll-snap 과 맞추기 위해 scrollIntoView 사용 */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    var target = document.querySelector(id);
    if (!target) return;
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  /* Fade-in */
  var fadeEls = document.querySelectorAll(".fade-section");

  if (fadeEls.length && !prefersReducedMotion()) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    fadeEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* 활성 탭: 현재 뷰 중심에 가장 가까운 스냅 슬라이드 */
  function updateActiveNav() {
    if (!navLinks.length || !slides.length) return;
    var mid = window.scrollY + window.innerHeight * 0.36;
    var current = slides[0].id;
    for (var i = slides.length - 1; i >= 0; i--) {
      var el = slides[i];
      if (el.offsetTop <= mid + 1) {
        current = el.id;
        break;
      }
    }
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (current === "cover") {
        link.classList.remove("active");
      } else {
        link.classList.toggle("active", href === "#" + current);
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
})();
