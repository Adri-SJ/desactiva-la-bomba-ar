(() => {
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let demo = params.get("demo") === "1";
  let targetVisible = false;

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

    const target = root.querySelector("#target");
    target.addEventListener("targetFound", () => setTargetVisible(true));
    target.addEventListener("targetLost", () => setTargetVisible(false));
  }

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
    BombGame.clearAll();
    $("result").classList.add("hidden");
    $("module-panel").classList.add("hidden");

    if (demo || targetVisible) $("mission-card").classList.remove("hidden");
    else $("tracking-message").classList.remove("hidden");
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) BombGame.clearAll();
  });
})();