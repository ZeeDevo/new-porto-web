/* =========================================================
   PHANTOM PORTFOLIO — interaksi
   ========================================================= */
(function () {
  "use strict";

  /* ---------- LOADER ---------- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.getElementById("loader").classList.add("done");
    }, 1500);
  });

  /* ---------- HERO CARD: 3D tilt + shine + flip ---------- */
  (function () {
    var stage = document.querySelector(".card-stage");
    var card = document.getElementById("heroCard");
    if (!stage || !card) return;
    var front = card.querySelector(".card-front img");
    var MAX = 12; /* deg tilt */

    /* tilt mengikuti kursor */
    function move(e) {
      if (card.classList.contains("flip")) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      var rx = (0.5 - py) * MAX * 2;
      var ry = (px - 0.5) * MAX * 2;
      card.style.transform =
        "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) scale(1.04)";
      if (front) front.style.transform = "scale(1.06) translate(" +
        (ry * 0.4).toFixed(1) + "px," + (-rx * 0.4).toFixed(1) + "px)";
    }
    function reset() {
      if (card.classList.contains("flip")) return;
      card.style.transform = "";
      if (front) front.style.transform = "";
    }
    function flip() {
      card.style.transform = ""; /* inline tilt menang atas class .flip kalau tidak dibersihkan */
      if (front) front.style.transform = "";
      card.classList.toggle("flip");
    }

    stage.addEventListener("mousemove", move);
    stage.addEventListener("mouseleave", reset);
    card.addEventListener("click", flip);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
  })();

  /* ---------- REVEAL on scroll ---------- */
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      if (e.target.classList.contains("skill")) e.target.classList.add("in");
      reveal.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll("[data-rev], .skill").forEach(function (el, i) {
    el.style.transitionDelay = (i % 6) * 0.06 + "s";
    reveal.observe(el);
  });

  /* ---------- ACTIVE TAB + PROGRESS ---------- */
  var tabs = document.querySelectorAll(".tab");
  var tabByHref = {};
  tabs.forEach(function (t) { tabByHref[t.getAttribute("href")] = t; });
  var panels = document.querySelectorAll(".panel");
  var progress = document.getElementById("progress");

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        var t = tabByHref["#" + e.target.id];
        if (t) t.classList.add("active");
      }
    });
  }, { threshold: 0.5 });
  panels.forEach(function (p) { spy.observe(p); });

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      progress.style.width = pct + "%";
      ticking = false;
    });
  });

  /* ---------- SMOOTH TAB CLICK ---------- */
  tabs.forEach(function (t) {
    t.addEventListener("click", function (ev) {
      ev.preventDefault();
      var target = document.querySelector(t.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- SKILL BARS animate on view ---------- */
  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        skillObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll(".skill").forEach(function (s) { skillObserver.observe(s); });

  /* ---------- POSTER DETAIL (lightbox) ---------- */
  (function () {
    var pv = document.getElementById("posterView");
    var grid = document.getElementById("posterGrid");
    if (!pv || !grid) return;
    var img = document.getElementById("pvImg");
    var t = document.getElementById("pvTitle");
    var tg = document.getElementById("pvTag");
    var d = document.getElementById("pvDesc");
    var y = document.getElementById("pvYear");
    var c = document.getElementById("pvCat");
    var open = document.getElementById("pvOpen");
    var lastFocus = null;

    function show(btn) {
      var src = btn.getAttribute("data-poster");
      img.src = src; img.alt = btn.getAttribute("data-title") || "";
      t.textContent = btn.getAttribute("data-title") || "";
      tg.textContent = btn.getAttribute("data-tag") || "POSTER";
      d.textContent = btn.getAttribute("data-desc") || "";
      y.textContent = btn.getAttribute("data-year") || "";
      c.textContent = (btn.getAttribute("data-tag") || "").split("·")[1] || "VISUAL";
      open.href = src;
      lastFocus = btn;
      pv.hidden = false;
      document.body.style.overflow = "hidden";
      pv.querySelector(".pv-x").focus();
    }
    function hide() {
      pv.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".poster-card");
      if (btn) show(btn);
    });
    pv.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) hide();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !pv.hidden) hide();
    });
  })();

  /* ---------- CONTACT FORM (demo only) ---------- */
  window.fake = function (ev) {
    ev.preventDefault();
    var msg = document.getElementById("formMsg");
    msg.textContent = "// PESAN TERKIRIM. NOTHING MORE TO SAY.";
    ev.target.reset();
    setTimeout(function () { msg.textContent = ""; }, 4000);
    return false;
  };

  /* ---------- KEYBOARD NAV (arrow up/down antar section) ---------- */
  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;
    var ids = ["home", "about", "skills", "works", "visual", "contact"];
    var cur = 0;
    ids.forEach(function (id, i) {
      var r = document.getElementById(id).getBoundingClientRect();
      if (r.top <= 10) cur = i;
    });
    var next = cur + (ev.key === "ArrowDown" ? 1 : -1);
    if (ids[next]) {
      document.getElementById(ids[next]).scrollIntoView({ behavior: "smooth" });
      ev.preventDefault();
    }
  });
})();
