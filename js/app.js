(() => {
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let demo = params.get("demo") === "1";
  let targetVisible = false;

  function assetsMarkup() {
    return `
      <a-assets>
        <a-asset-item id="model-battery" src="./assets/models/bateria.glb"></a-asset-item>
        <a-asset-item id="model-pipes" src="./assets/models/panel-tuberias.glb"></a-asset-item>
        <a-asset-item id="model-computer" src="./assets/models/computadora-scifi.glb"></a-asset-item>\n        <a-asset-item id="model-bomb" src="./assets/models/bomba-quaternius.glb"></a-asset-item>
      </a-assets>`;
  }

  function makeBombEntity() {
    return `
      <a-entity id="bomb" position="0 0 0" rotation="-18 0 0" scale="0.78 0.78 0.78">
        <a-gltf-model
          id="bomb-core"
          class="bomb-model"
          src="#model-bomb"
          position="0 -.05 .02"
          rotation="0 0 0"
          scale=".72 .72 .72">
        </a-gltf-model>

        <a-text value="AR-07" position="-.28 .38 .20" width=".9" color="#ff3b4e"></a-text>

        <a-cylinder class="bomb-led" position="-.28 -.32 .18" radius=".055" height=".025"
          rotation="90 0 0" color="#ffb020"></a-cylinder>
        <a-cylinder class="bomb-led" position="0 -.36 .18" radius=".055" height=".025"
          rotation="90 0 0" color="#ffb020"></a-cylinder>
        <a-cylinder class="bomb-led" position=".28 -.32 .18" radius=".055" height=".025"
          rotation="90 0 0" color="#ffb020"></a-cylinder>

        <a-ring position="0 .18 .20" radius-inner=".09" radius-outer=".14"
          color="#61dafb"
          animation="property: rotation; to: 0 0 360; loop: true; dur: 3600; easing: linear"></a-ring>

        <a-gltf-model
          id="module-pipes"
          class="module-model"
          visible="false"
          src="#model-pipes"
          position="-.95 .18 .10"
          rotation="-90 0 0"
          scale=".22 .22 .22"
          animation="property: position; to: -.95 .26 .10; dir: alternate; loop: true; dur: 1700; easing: easeInOutSine">
        </a-gltf-model>

        <a-gltf-model
          id="module-computer"
          class="module-model"
          visible="false"
          src="#model-computer"
          position=".95 .18 .10"
          rotation="0 180 0"
          scale=".22 .22 .22"
          animation="property: position; to: .95 .28 .10; dir: alternate; loop: true; dur: 1900; easing: easeInOutSine">
        </a-gltf-model>

        <a-gltf-model
          id="module-battery"
          class="module-model"
          visible="false"
          src="#model-battery"
          position="0 .72 .04"
          rotation="0 -20 0"
          scale=".28 .28 .28"
          animation="property: position; to: 0 .82 .04; dir: alternate; loop: true; dur: 2100; easing: easeInOutSine">
        </a-gltf-model>
      </a-entity>`;
  }

  function buildScene() {
    const root = $("scene-root");

    if (demo) {
      root.innerHTML = `
        <a-scene embedded vr-mode-ui="enabled:false" renderer="colorManagement:true">
          ${assetsMarkup()}
          <a-entity position="0 1.6 -2.5">
            ${makeBombEntity()}
          </a-entity>
          <a-camera position="0 1.6 0"></a-camera>
          <a-light type="ambient" intensity="1.25"></a-light>
          <a-light type="directional" position="1 2 2" intensity="1.4"></a-light>
        </a-scene>`;
      setTargetVisible(true);
      return;
    }

    root.innerHTML = `
      <a-scene
        mindar-image="imageTargetSrc: ./assets/targets/targets.mind; autoStart: true; uiScanning: no; uiLoading: no; uiError: no;"
        embedded
        color-space="sRGB"
        renderer="colorManagement:true; physicallyCorrectLights:true"
        vr-mode-ui="enabled:false"
        device-orientation-permission-ui="enabled:false">

        ${assetsMarkup()}

        <a-camera position="0 0 0" look-controls="enabled:false"></a-camera>
        <a-light type="ambient" intensity="1.2"></a-light>
        <a-light type="directional" position="1 2 1" intensity="1.1"></a-light>

        <a-entity id="target" mindar-image-target="targetIndex:0">
          ${makeBombEntity()}
        </a-entity>
      </a-scene>`;

    const target = root.querySelector("#target");
    target.addEventListener("targetFound", () => setTargetVisible(true));
    target.addEventListener("targetLost", () => setTargetVisible(false));
  }

  function showModuleModel(moduleIndex) {
    const bombCore = document.getElementById("bomb-core");
    const pipes = document.getElementById("module-pipes");
    const computer = document.getElementById("module-computer");
    const battery = document.getElementById("module-battery");
    const extras = [pipes, computer, battery];

    extras.forEach((el) => {
      if (el) el.setAttribute("visible", false);
    });

    if (moduleIndex === null || moduleIndex === undefined) {
      if (bombCore) bombCore.setAttribute("visible", true);
      return;
    }

    // FASE 1: la bomba redonda es la protagonista.
    // Los tres GLB anteriores quedan flotando como componentes del dispositivo.
    if (moduleIndex === 0) {
      if (bombCore) bombCore.setAttribute("visible", true);

      if (pipes) {
        pipes.setAttribute("visible", true);
        pipes.setAttribute("position", "-.95 .18 .10");
        pipes.setAttribute("rotation", "-90 0 0");
        pipes.setAttribute("scale", ".22 .22 .22");
      }

      if (computer) {
        computer.setAttribute("visible", true);
        computer.setAttribute("position", ".95 .18 .10");
        computer.setAttribute("rotation", "0 180 0");
        computer.setAttribute("scale", ".22 .22 .22");
      }

      if (battery) {
        battery.setAttribute("visible", true);
        battery.setAttribute("position", "0 .72 .04");
        battery.setAttribute("rotation", "0 -20 0");
        battery.setAttribute("scale", ".28 .28 .28");
      }

      return;
    }

    // A partir de aquí se retira la primera bomba para que no tape los demás modelos.
    if (bombCore) bombCore.setAttribute("visible", false);

    // FASE 2: computadora sci-fi, mucho más grande y centrada.
    if (moduleIndex === 1 && computer) {
      computer.setAttribute("visible", true);
      computer.setAttribute("position", "0 0 .18");
      computer.setAttribute("rotation", "0 180 0");
      computer.setAttribute("scale", "1.35 1.35 1.35");
      return;
    }

    // FASE 3: batería/celda de energía, grande y centrada.
    if (moduleIndex === 2 && battery) {
      battery.setAttribute("visible", true);
      battery.setAttribute("position", "0 0 .18");
      battery.setAttribute("rotation", "0 -20 0");
      battery.setAttribute("scale", "1.55 1.55 1.55");
    }
  }

  window.BombVisuals = { showModuleModel };

  function setTargetVisible(visible) {
    targetVisible = visible;
    $("tracking-message").classList.toggle("hidden", visible);

    if (visible && !BombGameIsRunning()) {
      $("mission-card").classList.remove("hidden");
    } else if (!visible) {
      $("mission-card").classList.add("hidden");
    }
  }

  function BombGameIsRunning() {
    return !$("module-panel").classList.contains("hidden") ||
           !$("result").classList.contains("hidden");
  }

  function enterExperience(forceDemo = false) {
    if (forceDemo) demo = true;
    GameAudio.ensure();

    $("intro").classList.add("hidden");
    $("ar-shell").classList.remove("hidden");

    buildScene();

    if (demo) {
      $("tracking-message").classList.add("hidden");
      $("mission-card").classList.remove("hidden");
    }
  }

  $("start-scan").addEventListener("click", () => enterExperience(false));
  $("demo-link").addEventListener("click", () => enterExperience(true));

  $("begin-game").addEventListener("click", () => {
    if (!demo && !targetVisible) return;
    GameAudio.ensure();
    window.BombVisuals.showModuleModel(0);
    BombGame.start();
  });

  $("restart").addEventListener("click", () => {
    BombGame.clearAll();
    window.BombVisuals.showModuleModel(null);

    $("result").classList.add("hidden");
    $("module-panel").classList.add("hidden");

    if (demo || targetVisible) {
      $("mission-card").classList.remove("hidden");
    } else {
      $("tracking-message").classList.remove("hidden");
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) BombGame.clearAll();
  });
})();