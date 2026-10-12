(() => {
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let demo = params.get("demo") === "1";
  let targetVisible = false;

  if (!AFRAME.components["model-feedback"]) {
    AFRAME.registerComponent("model-feedback", {
      schema: { label: { type: "string", default: "Objeto 3D" } },
      init() {
        this.el.addEventListener("click", () => {
          GameAudio.tick();
          const original = this.el.getAttribute("scale");
          this.el.setAttribute("animation__tap", {
            property: "scale",
            to: {
              x: original.x * 1.12,
              y: original.y * 1.12,
              z: original.z * 1.12
            },
            dur: 120,
            dir: "alternate",
            loop: 1,
            easing: "easeOutQuad"
          });

          const feedback = document.getElementById("feedback");
          const panel = document.getElementById("module-panel");
          if (feedback && panel && !panel.classList.contains("hidden")) {
            feedback.textContent = this.data.label;
            feedback.className = "feedback";
          }
        });
      }
    });
  }

  function assetsMarkup() {
    return `
      <a-assets>
        <a-asset-item id="model-battery" src="./assets/models/bateria.glb"></a-asset-item>
        <a-asset-item id="model-pipes" src="./assets/models/panel-tuberias.glb"></a-asset-item>
        <a-asset-item id="model-computer" src="./assets/models/computadora-scifi.glb"></a-asset-item>
      </a-assets>`;
  }

  function makeBombEntity() {
    return `
      <a-entity id="bomb" position="0 0 0" rotation="-18 0 0" scale="0.78 0.78 0.78">
        <a-box id="bomb-core" position="0 0 0" width="1.5" height=".78" depth=".24"
          color="#151b24" metalness=".75" roughness=".36"></a-box>

        <a-box position="0 .26 .14" width="1.02" height=".17" depth=".04"
          color="#090c11"></a-box>

        <a-text value="AR-07" position="-.43 .255 .168" width="1.3" color="#ff3b4e"></a-text>

        <a-cylinder class="bomb-led" position="-.43 -.02 .145" radius=".055" height=".025"
          rotation="90 0 0" color="#ffb020" emissive="#ffb020"></a-cylinder>
        <a-cylinder class="bomb-led" position="0 -.02 .145" radius=".055" height=".025"
          rotation="90 0 0" color="#ffb020" emissive="#ffb020"></a-cylinder>
        <a-cylinder class="bomb-led" position=".43 -.02 .145" radius=".055" height=".025"
          rotation="90 0 0" color="#ffb020" emissive="#ffb020"></a-cylinder>

        <a-box position="-.42 -.25 .145" width=".18" height=".18" depth=".04" color="#b51f32"></a-box>
        <a-box position="0 -.25 .145" width=".18" height=".18" depth=".04" color="#185da8"></a-box>
        <a-box position=".42 -.25 .145" width=".18" height=".18" depth=".04" color="#b68a13"></a-box>

        <a-ring position="0 .05 .16" radius-inner=".09" radius-outer=".14"
          color="#61dafb" emissive="#61dafb"
          animation="property: rotation; to: 0 0 360; loop: true; dur: 3600; easing: linear"></a-ring>

        <a-gltf-model
          class="model-clickable"
          src="#model-computer"
          position="0 .50 -.03"
          rotation="0 180 0"
          scale=".18 .18 .18"
          model-feedback="label: Terminal de control"
          animation="property: position; to: 0 .53 -.03; dir: alternate; loop: true; dur: 1800; easing: easeInOutSine">
        </a-gltf-model>

        <a-gltf-model
          class="model-clickable"
          src="#model-battery"
          position=".78 -.22 .02"
          rotation="0 -35 0"
          scale=".22 .22 .22"
          model-feedback="label: Celda de energía"
          animation="property: rotation; to: 0 325 0; loop: true; dur: 9000; easing: linear">
        </a-gltf-model>

        <a-gltf-model
          class="model-clickable"
          src="#model-pipes"
          position="-.78 -.20 -.02"
          rotation="-90 0 12"
          scale=".17 .17 .17"
          model-feedback="label: Módulo de circuitos">
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
          <a-camera
            position="0 1.6 0"
            cursor="rayOrigin: mouse"
            raycaster="objects: .model-clickable">
          </a-camera>
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

        <a-camera
          position="0 0 0"
          look-controls="enabled:false"
          cursor="rayOrigin: mouse"
          raycaster="objects: .model-clickable">
        </a-camera>

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
    const map = ["module-pipes", "module-computer", "module-battery"];
    document.querySelectorAll(".module-model").forEach((el) => {
      el.setAttribute("visible", false);
      el.removeAttribute("animation__enter");
    });

    if (moduleIndex === null || moduleIndex === undefined) return;

    const active = document.getElementById(map[moduleIndex]);
    if (!active) return;

    active.setAttribute("visible", true);

    const targetScale = active.getAttribute("scale");
    active.setAttribute("scale", {
      x: targetScale.x * 0.72,
      y: targetScale.y * 0.72,
      z: targetScale.z * 0.72
    });

    active.setAttribute("animation__enter", {
      property: "scale",
      to: targetScale,
      dur: 320,
      easing: "easeOutBack"
    });
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
    return !$("module-panel").classList.contains("hidden") || !$("result").classList.contains("hidden");
  }

  function enterExperience(forceDemo = false) {
    if (forceDemo) demo = true;
    GameAudio.ensure();

    $("intro").classList.remove("screen--visible");
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
    BombGame.start();
  });

  $("restart").addEventListener("click", () => {
    BombGame.clearAll();\n    window.BombVisuals?.showModuleModel(null);
    $("result").classList.add("hidden");
    $("module-panel").classList.add("hidden");

    if (demo || targetVisible) $("mission-card").classList.remove("hidden");
    else $("tracking-message").classList.remove("hidden");
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) BombGame.clearAll();
  });
})();