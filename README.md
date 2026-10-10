# Desactiva la bomba AR

Minijuego de Realidad Aumentada para móvil. La experiencia se activa al reconocer un marcador personalizado y reta al jugador a completar tres módulos antes de que termine el tiempo.

## Objetivo
Completar los tres módulos del dispositivo antes de que el contador llegue a cero y sin perder las tres vidas.

## Mecánicas
- **Módulo 1 — Circuitos:** identificar el cable correcto a partir de una pista visual.
- **Módulo 2 — Secuencia:** memorizar y repetir una secuencia de símbolos.
- **Módulo 3 — Estabilizador:** detener una barra móvil dentro de la zona segura.
- Puntaje, vidas, cronómetro y finales de victoria/derrota.
- Retroalimentación visual, sonora y vibración cuando el dispositivo lo permite.

## Tecnologías
- HTML, CSS y JavaScript
- A-Frame
- MindAR Image Tracking
- Web Audio API
- Vercel (despliegue previsto)

## Estructura
```
.
├── index.html
├── css/styles.css
├── js/app.js
├── assets/targets/
├── assets/models/
└── assets/audio/
```

## Marcador
El archivo final `assets/targets/targets.mind` se generará a partir del QR personalizado definitivo. Hasta agregarlo, el juego puede probarse con `?demo=1`.

## Recursos externos y licencias
Los modelos 3D, sonidos y música definitivos se documentarán aquí con autor, URL original y licencia antes de la entrega.

## Estado
🚧 En desarrollo.
