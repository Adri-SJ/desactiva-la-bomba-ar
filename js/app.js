(() => {
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let demo = params.get("demo") === "1";
  let targetVisible = false;

  function makeBombEntity() {
    return `
      <a-entity id="bomb-stage" position="0 0 0" rotation="-8 0 0">

        <a-gltf-model
          id="bomb-1"
          class="phase-bomb"
          src="./assets/models/bomba-quaternius.glb"
          fit-gltf="size: 1.05"
          position="0 .02 .18"
          rotation="0 0 0">
        </a-gltf-model>

        <a-gltf-model
          id="bomb-2"
          class="phase-bomb"
          visible="false"
          src="./assets/models/c4_bomb_low_poly.glb"
          fit-gltf="size: 1.22"
          position="0 .02 .18"
          rotation="0 0 0">
        </a-gltf-model>

        <a-gltf-model
          id="bomb-3"
          class="phase-bomb"
          visible="false"
          src="./assets/models/time_bomb.glb"
          fit-gltf="size: .62"
          position="0 .02 .18"
          rotation="0 0 0"
          scale=".48 .48 .48">
        </a-gltf-model>

        <a-text id="bomb-label" value="AR-07" position="-.22 .52 .22" width=".75" color="#ff3b4e"></a-text>

        <a-cylinder class="bomb-led" position="-.28 -.44 .20" radius=".045" height=".025"
          rotation="90 0 0" color="#ffb020"></a-cylinder>
        <a-cylinder class="bomb-led" position="0 -.47 .20" radius=".045" height=".025"
          rotation="90 0 0" color="#ffb020"></a-cylinder>
        <a-cylinder class="bomb-led" position=".28 -.44 .20" radius=".045" height=".025"
          rotation="90 0 0" color="#ffb020"></a-cylinder>
      </a-entity>`;
  }

  function buildScene() {
    const root = $("scene-root");

    if (demo) {
      root.innerHTML = `
        <a-scene embedded vr-mode-ui="enabled:false" renderer="colorManagement:true">

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

        <a-camera position="0 0 0" look-controls="enabled:false"></a-camera>
        <a-light type="ambient" intensity="1.2"></a-light>
        <a-light type="directional" position="1 2 1" intensity="1.1"></a-light>

        <a-entity id="target" mindar-image-target="targetIndex:0">
          ${makeBombEntity()}
        </a-entity>
      </a-scene>`;

    root.querySelectorAll("a-gltf-model").forEach((model) => {
      model.addEventListener("model-error", (event) => {
        console.error("Error cargando GLB:", model.getAttribute("src"), event.detail);
      });
    });

    const target = root.querySelector("#target");
    target.addEventListener("targetFound", () => setTargetVisible(true));
    target.addEventListener("targetLost", () => setTargetVisible(false));
  }

  function showModuleModel(moduleIndex) {
    const bombs = [
      document.getElementById("bomb-1"),
      document.getElementById("bomb-2"),
      document.getElementById("bomb-3")
    ];

    const label = document.getElementById("bomb-label");

    bombs.forEach((bomb) => {
      if (bomb) bomb.setAttribute("visible", false);
    });

    if (moduleIndex === null || moduleIndex === undefined) {
      if (bombs[0]) bombs[0].setAttribute("visible", true);
      if (label) label.setAttribute("value", "AR-07");
      return;
    }

    const active = bombs[moduleIndex];
    if (active) active.setAttribute("visible", true);

    if (label) {
      label.setAttribute("value", `AR-0${moduleIndex + 7}`);
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