# Garabato 3D

Dibujá en 2D, dale altura, forma y giro, y descargá el archivo **STL o 3MF** para imprimirlo en 3D. Todo corre en tu navegador: no hay servidor, no hay cuentas y tus dibujos no salen de tu equipo.

> Una colaboración de **Disain** con **Pablo Melgarejo** y **Diego Carrasco**, para beneficio de la educación y la ampliación del conocimiento humano.

## Usarlo

Abrí la página publicada (por ejemplo `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`) o abrí `index.html` en un navegador moderno.

- **Lápiz, puntos y formas** (círculo, caja, estrella, corazón): todo trazo queda como una pared fina.
- **Texto:** escribí una palabra, elegí el tamaño con el selector, y se vuelve una figura sólida (tocá un texto con la herramienta para editarlo).
- **Balde:** rellena una figura cerrada para que quede sólida.
- **Flechas en 3D:** tocá una figura en la vista 3D y arrastrá la flecha rosa (altura) o las azules (ancho y largo).
- **Forma y Giro:** cambian la silueta y el giro de la figura seleccionada.
- **Hueco:** convertí una figura en hueco para restarla de las que toca, de lado a lado (pasante) o con profundidad desde arriba.
- **Celular:** el switch de arriba alterna entre Dibujar y Vista 3D; en el papel podés hacer zoom con dos dedos (o con + / −) y moverlo con dos dedos.
- **Color:** cambia el color de la figura seleccionada.
- **Imagen:** cargá una foto con la cámara, ajustá su tamaño desde las esquinas y calcala con el lápiz.
- **Cama de impresión:** 200, 256 o 300 mm, desde el menú del logo.
- **Guardar:** el menú del logo guarda tus dibujos en este navegador (`localStorage`).
- **Descargar:** genera `garabato3d.stl`, en milímetros.

## Correrlo en tu computadora

No hace falta instalar nada. Desde esta carpeta:

```bash
python3 -m http.server 8080
```

y abrí <http://localhost:8080>.

## Publicarlo con GitHub Pages

1. Creá un repositorio nuevo (público si usás el plan gratuito de GitHub).
2. Subí `index.html`, `LICENSE` y este `README.md`.
3. En **Settings → Pages**, elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. Esperá un minuto y abrí la dirección que GitHub te muestra.

## Cómo está hecho

Un solo archivo HTML, sin paso de compilación. Dibuja en `canvas` 2D, arma la malla 3D capa por capa (extrusión con giro y silueta) y la muestra con Three.js. Las paredes y los rellenos se calculan con Clipper para que no fallen con esquinas filosas ni trazos que se cruzan.

## Licencias de terceros

Se cargan desde internet, no se incluyen en este repositorio:

- [Three.js](https://threejs.org/), licencia MIT.
- [Clipper (JavaScript)](https://sourceforge.net/projects/jsclipper/) de Angus Johnson, Boost Software License 1.0.
- Tipografías Gochi Hand, Patrick Hand y Nunito, de Google Fonts, bajo la SIL Open Font License.

Inspirado en [Doodle3D Transform](https://github.com/Doodle3D/Doodle3D-Transform) (licencia MIT). Garabato 3D es un proyecto independiente, con código propio y sin relación con el equipo de Doodle3D.

## Licencia

[MIT](LICENSE) © 2026 Disain Team, Pablo Melgarejo y Diego Carrasco.
