# GarabateAR

Dibujá en 2D, dale altura, forma y giro, y descargá el archivo **STL o 3MF** para imprimirlo en 3D. Todo corre en tu navegador: no hay servidor, no hay cuentas y tus dibujos no salen de tu equipo.

> Una colaboración de **Disain** con **Pablo Melgarejo** y **Diego Carrasco**, para beneficio de la educación y la ampliación del conocimiento humano.

## Usarlo

Entrá a <https://garabatear.com.ar>: primero aparece la página de presentación y desde **Abrir la app** se entra a la app, en <https://garabatear.com.ar/app/>. Desde la app se vuelve a la presentación con **Conocé GarabateAR**, en el menú del logo.

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

## Qué hay en este repositorio

- `index.html` y `assets/`: la página de presentación ya compilada (no se editan a mano).
- `images/`: imágenes y videos de la presentación.
- `app/index.html`: **la app**. Es un solo archivo; se edita directo, sin compilar.
- `landing/`: el código de la presentación (React + Tailwind). Solo hace falta si querés cambiar textos o diseño de la presentación.
- `CNAME`: el dominio `garabatear.com.ar`.

### Cambiar la presentación

Hace falta [Node.js](https://nodejs.org). Desde la carpeta `landing/`:

```bash
npm install      # una sola vez
npm run dev      # para verla mientras la editás (también sirve /app/ e /images/)
npm run build    # vuelve a generar index.html y assets/ en la raíz del repo
```

Después subí los cambios de `index.html`, `assets/` y `landing/`.

## Correrlo en tu computadora

No hace falta instalar nada. Desde esta carpeta:

```bash
python3 -m http.server 8080
```

y abrí <http://localhost:8080> (presentación) o <http://localhost:8080/app/> (app).

## Publicarlo con GitHub Pages

1. Creá un repositorio nuevo (público si usás el plan gratuito de GitHub).
2. Subí todo el contenido de este repositorio (incluido el archivo `.nojekyll`).
3. En **Settings → Pages**, elegí **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. Esperá un minuto y abrí la dirección que GitHub te muestra.

## Cómo está hecho

La app es un solo archivo HTML (`app/index.html`), sin paso de compilación. Dibuja en `canvas` 2D, arma la malla 3D capa por capa (extrusión con giro y silueta) y la muestra con Three.js. Las paredes y los rellenos se calculan con Clipper para que no fallen con esquinas filosas ni trazos que se cruzan.

## Licencias de terceros

Se cargan desde internet, no se incluyen en este repositorio:

- [Three.js](https://threejs.org/), licencia MIT.
- [Clipper (JavaScript)](https://sourceforge.net/projects/jsclipper/) de Angus Johnson, Boost Software License 1.0.
- Tipografías Gochi Hand, Patrick Hand y Nunito, de Google Fonts, bajo la SIL Open Font License.

Inspirado en [Doodle3D Transform](https://github.com/Doodle3D/Doodle3D-Transform) (licencia MIT). GarabateAR es un proyecto independiente, con código propio y sin relación con el equipo de Doodle3D.

## Licencia

[MIT](LICENSE) © 2026 Disain Team, Pablo Melgarejo y Diego Carrasco.
