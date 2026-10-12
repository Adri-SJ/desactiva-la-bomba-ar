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
- Los tres modelos 3D de apoyo reaccionan al toque con sonido y una pequeña animación.

## Tecnologías
- HTML, CSS y JavaScript
- A-Frame
- MindAR Image Tracking
- Web Audio API
- Vercel

## Estructura
```
.
├── index.html
├── css/styles.css
├── js/
│   ├── app.js
│   ├── game.js
│   └── audio.js
└── assets/
    ├── targets/
    │   ├── marker-bomba.png
    │   └── targets.mind
    ├── models/
    │   ├── bateria.glb
    │   ├── panel-tuberias.glb
    │   └── computadora-scifi.glb
    └── audio/
```

## Marcador
El marcador visual se encuentra en `assets/targets/marker-bomba.png` y fue compilado con MindAR como `assets/targets/targets.mind`.

El QR de acceso a la experiencia web es independiente del marcador utilizado para posicionar el contenido AR.

## Modelos 3D y licencias

Los tres modelos utilizados son de **Quaternius** y se distribuyen como **Public Domain / CC0**, por lo que pueden utilizarse y modificarse libremente.

| Archivo en el proyecto | Modelo original | Autor | Licencia | Fuente |
|---|---|---|---|---|
| `bateria.glb` | Battery | Quaternius | CC0 / Public Domain | https://poly.pizza/m/MYa3uWdwPU |
| `panel-tuberias.glb` | Pipes Panel | Quaternius | CC0 / Public Domain | https://poly.pizza/m/rzvuy93JU3 |
| `computadora-scifi.glb` | Scifi Computer | Quaternius | CC0 / Public Domain | https://poly.pizza/m/U0xmt6tUlL |

Los archivos GLB integrados son ligeros y se mantienen muy por debajo del límite recomendado de 5 MB por modelo.

## Interacción y retroalimentación
- Sonido de acierto y error mediante Web Audio API.
- Vibración en dispositivos compatibles.
- Cambio visual de estado en la bomba.
- Retroalimentación por puntuación, vidas y tiempo.
- Interacción táctil con los modelos 3D.
- Pantallas de victoria y derrota.

## Cómo probar
1. Abrir la experiencia desde un teléfono.
2. Permitir acceso a la cámara.
3. Apuntar al marcador `marker-bomba.png`.
4. Cuando se detecte el marcador, pulsar **Iniciar misión**.
5. Completar los tres módulos antes de agotar el tiempo o las vidas.

Para probar la lógica sin marcador puede utilizarse el parámetro:

`?demo=1`

## Estado
✅ Experiencia funcional en móvil con tracking de marcador, lógica de juego y modelos 3D integrados.

## Pendientes de entrega
- Añadir capturas finales.
- Grabar video demo de 30–60 s.
- Añadir enlace final de Vercel.
- Publicar artículo breve de LinkedIn.
