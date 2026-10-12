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

La experiencia utiliza tres bombas principales. La primera es CC0 de Quaternius y las dos bombas realistas de las fases 2 y 3 están bajo licencia CC BY 4.0, por lo que se acredita a sus autores.

| Archivo en el proyecto | Modelo original | Autor | Licencia | Fuente |
|---|---|---|---|---|
| `bomba-quaternius.glb` | Bomb | Quaternius | CC0 / Public Domain | https://poly.pizza/m/0oNZ1y6ghg |
| `c4-bomb.glb` | C4-bomb | AJ / ArneJans | CC BY 4.0 | https://sketchfab.com/3d-models/c4-bomb-fc33f6537918437c80ceeb0d51707e50 |
| `time_bomb.glb` | Time Bomb | barism09 | CC BY 4.0 | https://sketchfab.com/3d-models/time-bomb-0f5deb2dcbd9416dac3b72a3fd85d054 |
| `bateria.glb` | Battery | Quaternius | CC0 / Public Domain | https://poly.pizza/m/MYa3uWdwPU |
| `panel-tuberias.glb` | Pipes Panel | Quaternius | CC0 / Public Domain | https://poly.pizza/m/rzvuy93JU3 |
| `computadora-scifi.glb` | Scifi Computer | Quaternius | CC0 / Public Domain | https://poly.pizza/m/U0xmt6tUlL |

El modelo `time_bomb.glb` pesa aproximadamente 3.8 MB. `c4-bomb.glb` pesa aproximadamente 6.1 MB, así que conviene vigilar su tiempo de carga en móvil y optimizarlo si hiciera falta.

## Interacción y retroalimentación
- Sonido de acierto y error mediante Web Audio API.\n- Efecto sintetizado de explosión al perder, acompañado de vibración, flash y sacudida de pantalla.
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
