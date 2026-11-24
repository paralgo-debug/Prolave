(function () {
  var NUM = "5527996668073";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Links do WhatsApp
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + NUM + "?text=" + encodeURIComponent(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Ano do rodapé
  document.getElementById("ano").textContent = new Date().getFullYear();

  // Bolhas do hero
  var b = document.querySelector(".bubbles");
  if (b && !reduce) {
    for (var i = 0; i < 14; i++) {
      var s = document.createElement("i"), d = 14 + Math.random() * 46;
      s.style.cssText = "left:" + Math.random() * 100 + "%;width:" + d + "px;height:" + d +
        "px;--dx:" + (Math.random() * 80 - 40) + "px;animation-duration:" + (14 + Math.random() * 16) +
        "s;animation-delay:-" + Math.random() * 20 + "s";
      b.appendChild(s);
    }
  }

  // Antes e depois
  document.querySelectorAll("[data-ba]").forEach(function (el) {
    var inp = el.querySelector("input");
    function set(v) { el.style.setProperty("--p", v + "%"); }
    inp.addEventListener("input", function () { set(inp.value); });
    if (reduce) return;
    var done = false;
    new IntersectionObserver(function (e, o) {
      if (!e[0].isIntersecting || done) return;
      done = true; o.disconnect();
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min((t - t0) / 2200, 1);
        var v = 50 + Math.sin(k * Math.PI * 2) * 38 * (1 - k * .4);
        set(v); inp.value = v;
        if (k < 1) requestAnimationFrame(step); else { set(50); inp.value = 50; }
      })(t0);
    }, { threshold: .6 }).observe(el);
  });

  // Vídeos: tocam apenas quando visíveis
  var vo = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) e.target.play().catch(function () {});
      else e.target.pause();
    });
  }, { threshold: .4 });
  document.querySelectorAll(".videos video").forEach(function (v) { vo.observe(v); });

  // Depoimentos em loop contínuo
  var tr = document.querySelector(".track");
  if (tr) tr.innerHTML += tr.innerHTML;

  // Entrada suave das seções
  var ro = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll(".sec").forEach(function (s) { s.classList.add("reveal"); ro.observe(s); });

  // Aberto agora (horário de Brasília)
  var st = document.getElementById("status");
  try {
    var p = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
    var wd = p.find(function (x) { return x.type === "weekday"; }).value;
    var h = parseInt(p.find(function (x) { return x.type === "hour"; }).value, 10) % 24;
    var open = wd !== "Sun" && h >= 9 && h < 18;
    st.textContent = open ? "Aberto agora" : "Fechado agora";
    st.className = open ? "on" : "off";
  } catch (e) {}

  // Contadores
  document.querySelectorAll("[data-count]").forEach(function (c) {
    if (reduce) return;
    var to = parseFloat(c.dataset.count), dec = c.dataset.count.indexOf(".") > -1, t0 = performance.now();
    (function step(t) {
      var k = Math.min((t - t0) / 1400, 1), v = to * (1 - Math.pow(1 - k, 3));
      c.textContent = dec ? v.toFixed(1).replace(".", ",") : Math.round(v);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  });
})();
