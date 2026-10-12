window.GameAudio = (() => {
  let ctx = null;

  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq = 440, duration = .12, type = "sine", volume = .055, delay = 0) {
    const c = ensure();
    const osc = c.createOscillator();
    const gain = c.createGain();
    const start = c.currentTime + delay;

    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);

    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(start);
    osc.stop(start + duration);
  }

  function success() {
    tone(520, .10, "sine", .05);
    tone(680, .11, "sine", .05, .09);
    tone(880, .16, "sine", .055, .18);
    vibrate([35, 25, 35]);
  }

  function error() {
    tone(170, .18, "sawtooth", .05);
    tone(120, .24, "square", .03, .10);
    vibrate([90, 45, 90]);
  }

  function tick() {
    tone(850, .035, "square", .018);
  }

  function win() {
    [440, 554, 659, 880].forEach((f, i) => tone(f, .18, "sine", .05, i * .11));
    vibrate([60, 35, 60, 35, 120]);
  }

  function lose() {
    tone(180, .25, "sawtooth", .05);
    tone(145, .3, "sawtooth", .045, .18);
    tone(110, .45, "square", .035, .40);
    vibrate([180, 80, 180]);
  }

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  return { ensure, success, error, tick, win, lose, explosion, vibrate };
})();