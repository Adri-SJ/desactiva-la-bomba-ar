window.BombGame = (() => {
  const state = {
    time: 60,
    lives: 3,
    score: 0,
    module: 0,
    running: false,
    timerId: null,
    energyRaf: null,
    energyStart: 0,
    sequence: [],
    inputIndex: 0,
    locked: false,
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
    state.time = 60;
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
    $("module-instruction").textContent = "El indicador central parpadea en AZUL. Corta el circuito conectado al mismo color.";
    $("module-content").innerHTML = `
      <div class="grid3">
        <button class="wire-btn wire-red" data-wire="red">ROJO</button>
        <button class="wire-btn wire-blue" data-wire="blue">AZUL</button>
        <button class="wire-btn wire-yellow" data-wire="yellow">AMARILLO</button>
      </div>`;

    document.querySelectorAll("[data-wire]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (state.locked) return;
        if (btn.dataset.wire === "blue") {
          correct(150, "Circuito aislado.");
          btn.disabled = true;
          $("module-status").style.background = "var(--ok)";
          nextModule();
        } else {
          wrong("Circuito incorrecto.", 5);
        }
      });
    });
  }

  function renderSequence() {
    $("module-instruction").textContent = "Memoriza la secuencia de símbolos y repítela cuando termine.";
    const symbols = ["▲", "●", "■"];
    state.sequence = Array.from({length: 4}, () => Math.floor(Math.random() * 3));
    state.inputIndex = 0;

    $("module-content").innerHTML = `
      <div class="grid3">
        ${symbols.map((s, i) => `<button class="symbol-btn" data-symbol="${i}" disabled>${s}</button>`).join("")}
      </div>`;

    const buttons = [...document.querySelectorAll("[data-symbol]")];
    state.locked = true;

    state.sequence.forEach((idx, n) => {
      setTimeout(() => {
        buttons[idx].classList.add("flash");
        GameAudio.tick();
        setTimeout(() => buttons[idx].classList.remove("flash"), 260);
      }, 500 + n * 650);
    });

    setTimeout(() => {
      buttons.forEach(b => b.disabled = false);
      state.locked = false;
      setFeedback("Tu turno.");
    }, 500 + state.sequence.length * 650);

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (state.locked) return;
        const value = Number(btn.dataset.symbol);
        const expected = state.sequence[state.inputIndex];

        if (value === expected) {
          state.inputIndex++;
          GameAudio.tick();
          btn.classList.add("flash");
          setTimeout(() => btn.classList.remove("flash"), 140);

          if (state.inputIndex === state.sequence.length) {
            state.locked = true;
            correct(250, "Secuencia validada.");
            $("module-status").style.background = "var(--ok)";
            nextModule();
          }
        } else {
          wrong("Secuencia incorrecta. Mira una nueva.", 7);
          if (!state.running) return;
          state.inputIndex = 0;
          setTimeout(renderSequence, 700);
        }
      });
    });
  }

  function renderEnergy() {
    $("module-instruction").textContent = "Detén el pulso cuando el cursor esté dentro de la zona verde.";
    $("module-content").innerHTML = `
      <div class="energy-wrap">
        <div class="energy-track">
          <div class="safe-zone"></div>
          <div id="energy-cursor" class="energy-cursor"></div>
        </div>
        <button id="lock-energy" class="primary">BLOQUEAR ENERGÍA</button>
      </div>`;

    const cursor = $("energy-cursor");
    state.energyStart = performance.now();

    const animate = (now) => {
      if (!state.running || state.module !== 2) return;
      const t = (now - state.energyStart) / 1000;
      const x = (Math.sin(t * 4.1 - Math.PI / 2) + 1) / 2;
      cursor.style.left = `calc(${(x * 100).toFixed(2)}% - 4px)`;
      cursor.dataset.x = x.toFixed(4);
      state.energyRaf = requestAnimationFrame(animate);
    };
    state.energyRaf = requestAnimationFrame(animate);

    $("lock-energy").addEventListener("click", () => {
      if (state.locked) return;
      const x = Number(cursor.dataset.x || 0);
      if (x >= .40 && x <= .60) {
        cancelAnimationFrame(state.energyRaf);
        correct(350, "Energía estabilizada.");
        $("module-status").style.background = "var(--ok)";
        state.locked = true;
        setTimeout(win, 850);
      } else {
        wrong("Pulso fuera de rango.", 6);
      }
    });
  }

  function win() {
    if (!state.running) return;
    state.running = false;
    clearInterval(state.timerId);
    cancelAnimationFrame(state.energyRaf);

    const bonus = Math.max(0, state.time) * 10 + state.lives * 100;
    state.score += bonus;
    ui();
    updateBombProgress(3);
    flashBomb("ok");
    GameAudio.win();

    $("module-panel").classList.add("hidden");
    $("result-kicker").textContent = "MISIÓN COMPLETADA";
    $("result-title").textContent = "DISPOSITIVO ESTABILIZADO";
    $("result-copy").textContent = `Bonus de misión: +${bonus} puntos por tiempo y vidas restantes.`;
    $("final-score").textContent = String(state.score).padStart(4, "0");
    $("result").classList.remove("hidden");
  }

  function lose(reason) {
    if (!state.running) return;
    state.running = false;
    clearInterval(state.timerId);
    cancelAnimationFrame(state.energyRaf);
    state.time = Math.max(0, state.time);
    ui();
    flashBomb("bad");
    GameAudio.lose();

    $("module-panel").classList.add("hidden");
    $("result-kicker").textContent = "MISIÓN FALLIDA";
    $("result-title").textContent = "SISTEMA CRÍTICO";
    $("result-copy").textContent = reason;
    $("final-score").textContent = String(state.score).padStart(4, "0");
    $("result").classList.remove("hidden");
  }

  function clearAll() {
    clearInterval(state.timerId);
    cancelAnimationFrame(state.energyRaf);
  }

  function updateBombProgress(step) {
    document.querySelectorAll(".bomb-led").forEach((led, i) => {
      led.setAttribute("color", i < step ? "#53e68b" : "#ffb020");
      led.setAttribute("emissive", i < step ? "#53e68b" : "#ffb020");
    });
  }

  function flashBomb(type) {
    const core = document.querySelector("#bomb-core");
    if (!core) return;
    const c = type === "ok" ? "#53e68b" : "#ff3b4e";
    core.setAttribute("color", c);
    setTimeout(() => core.setAttribute("color", "#151b24"), 260);
  }

  return { start, clearAll };
})();