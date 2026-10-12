window.BombGame = (() => {
  const state = {
    time: 90,
    lives: 3,
    score: 0,
    module: 0,
    running: false,
    timerId: null,
    energyRaf: null,
    energyStart: 0,
    sequence: [],
    inputIndex: 0,
    locked: false,\n    energyHits: 0,
  };

  const modules = [
    { title: "Circuitos", kicker: "MÓDULO 1/3" },
    { title: "Memoria", kicker: "MÓDULO 2/3" },
    { title: "Estabilizador", kicker: "MÓDULO 3/3" },
  ];

  const $ = (id) => document.getElementById(id);

  function ui() {
    $("time").textContent = String(state.time).padStart(2, "0");
    $("score").textContent = String(state.score).padStart(4, "0");
    $("lives").textContent = "❤".repeat(Math.max(0, state.lives)) + "♡".repeat(Math.max(0, 3 - state.lives));
    $("time").classList.toggle("danger", state.time <= 10);
  }

  function setFeedback(text, type = "") {
    const el = $("feedback");
    el.textContent = text;
    el.className = "feedback" + (type ? " " + type : "");
  }

  function start() {
    clearAll();
    state.time = 90;
    state.lives = 3;
    state.score = 0;
    state.module = 0;
    state.running = true;
    state.locked = false;
    ui();

    $("mission-card").classList.add("hidden");
    $("result").classList.add("hidden");
    $("module-panel").classList.remove("hidden");

    renderModule();
    state.timerId = setInterval(() => {
      if (!state.running) return;
      state.time--;
      if (state.time <= 10 && state.time > 0) GameAudio.tick();
      ui();
      if (state.time <= 0) lose("Se agotó el tiempo antes de estabilizar todos los módulos.");
    }, 1000);
  }

  function wrong(message, timePenalty = 5) {
    if (!state.running || state.locked) return;
    state.lives--;
    state.time = Math.max(0, state.time - timePenalty);
    state.score = Math.max(0, state.score - 50);
    setFeedback(message + `  -1 vida · -${timePenalty}s`, "bad");
    GameAudio.error();
    flashBomb("bad");
    ui();

    if (state.lives <= 0) lose("El dispositivo entró en estado crítico: te quedaste sin vidas.");
    else if (state.time <= 0) lose("La penalización agotó el tiempo disponible.");
  }

  function correct(points, message) {
    state.score += points;
    setFeedback(`${message}  +${points} pts`, "ok");
    GameAudio.success();
    flashBomb("ok");
    ui();
  }

  function nextModule(delay = 800) {
    state.locked = true;
    setTimeout(() => {
      state.module++;
      state.locked = false;
      if (state.module >= modules.length) return win();
      renderModule();
    }, delay);
  }

  function renderModule() {
    const m = modules[state.module];
    $("module-kicker").textContent = m.kicker;
    $("module-title").textContent = m.title;
    $("module-status").style.background = "var(--warn)";
    $("module-content").innerHTML = "";
    setFeedback("");

    if (state.module === 0) renderWires();
    if (state.module === 1) renderSequence();
    if (state.module === 2) renderEnergy();
    updateBombProgress(state.module);
  }

  function renderWires() {
    const wires = [
      { key: "red", label: "ROJO", className: "wire-red" },
      { key: "blue", label: "AZUL", className: "wire-blue" },
      { key: "yellow", label: "AMARILLO", className: "wire-yellow" }
    ];
    const target = wires[Math.floor(Math.random() * wires.length)];

    $("module-instruction").textContent =
      `El indicador central marca ${target.label}. Corta el circuito del mismo color.`;

    $("module-content").innerHTML = `
      <div class="grid3">
        ${wires.map(w => `<button class="wire-btn ${w.className}" data-wire="${w.key}">${w.label}</button>`).join("")}
      </div>`;

    document.querySelectorAll("[data-wire]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (state.locked) return;

        if (btn.dataset.wire === target.key) {
          correct(150, `Circuito ${target.label} aislado.`);
          document.querySelectorAll("[data-wire]").forEach(b => b.disabled = true);
          $("module-status").style.background = "var(--ok)";
          nextModule();
        } else {
          wrong("Circuito incorrecto.", 5);
        }
      });
    });
  }
  function renderEnergy() {
    state.energyHits = 0;
    $("module-instruction").textContent =
      "Estabiliza el núcleo 3 veces. La zona segura se hará más pequeña en cada acierto.";

    $("module-content").innerHTML = `
      <div class="energy-wrap">
        <div class="energy-track">
          <div id="safe-zone" class="safe-zone"></div>
          <div id="energy-cursor" class="energy-cursor"></div>
        </div>
        <div id="energy-progress" style="text-align:center;font-weight:800;">ESTABILIZACIONES: 0/3</div>
        <button id="lock-energy" class="primary">BLOQUEAR ENERGÍA</button>
      </div>`;

    const cursor = $("energy-cursor");
    const safeZone = $("safe-zone");
    const progress = $("energy-progress");

    const rounds = [
      { min: .36, max: .64, width: 28 },
      { min: .41, max: .59, width: 18 },
      { min: .455, max: .545, width: 9 }
    ];

    function configureRound() {
      const round = rounds[state.energyHits];
      const left = ((1 - round.width / 100) / 2) * 100;
      safeZone.style.left = `${left}%`;
      safeZone.style.width = `${round.width}%`;
      progress.textContent = `ESTABILIZACIONES: ${state.energyHits}/3`;
      state.energyStart = performance.now();
    }

    configureRound();

    const animate = (now) => {
      if (!state.running || state.module !== 2) return;
      const t = (now - state.energyStart) / 1000;
      const speed = 4.0 + state.energyHits * 0.8;
      const x = (Math.sin(t * speed - Math.PI / 2) + 1) / 2;
      cursor.style.left = `calc(${(x * 100).toFixed(2)}% - 4px)`;
      cursor.dataset.x = x.toFixed(4);
      state.energyRaf = requestAnimationFrame(animate);
    };

    state.energyRaf = requestAnimationFrame(animate);

    $("lock-energy").addEventListener("click", () => {
      if (state.locked) return;

      const x = Number(cursor.dataset.x || 0);
      const round = rounds[state.energyHits];

      if (x >= round.min && x <= round.max) {
        state.energyHits++;
        correct(125, `Estabilización ${state.energyHits}/3 correcta.`);

        if (state.energyHits >= 3) {
          cancelAnimationFrame(state.energyRaf);
          $("module-status").style.background = "var(--ok)";
          state.locked = true;
          setFeedback("Núcleo completamente estabilizado. +375 pts", "ok");
          setTimeout(win, 850);
          return;
        }

        configureRound();
        setFeedback(
          `Bien. Ahora la zona segura es más pequeña (${state.energyHits + 1}/3).`,
          "ok"
        );
      } else {
        wrong("Pulso fuera de rango.", 6);
      }
    });
  }
;