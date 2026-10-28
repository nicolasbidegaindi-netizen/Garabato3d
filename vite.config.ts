import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream, existsSync, rmSync, statSync } from 'node:fs';
import { resolve, normalize } from 'node:path';

// La landing se compila directo a la raíz del repo (index.html + assets/), que es lo que publica GitHub Pages.
// Las imágenes y videos viven una sola vez en /images y la app en /app (no se tocan al compilar).
const ROOT = resolve(__dirname, '..');

// En `npm run dev`, sirve /images/* y /app/* desde la raíz del repo para ver todo igual que publicado.
const serveRepoFiles = (): Plugin => ({
  name: 'serve-repo-files',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      let url = decodeURIComponent((req.url || '').split('?')[0]);
      if (!url.startsWith('/images/') && !url.startsWith('/app')) return next();
      if (url === '/app' ) { res.statusCode = 302; res.setHeader('Location', '/app/'); return res.end(); }
      if (url.endsWith('/')) url += 'index.html';
      const file = normalize(resolve(ROOT, '.' + url));
      if (!file.startsWith(ROOT) || !existsSync(file)) return next();
      const types: Record<string, string> = { html: 'text/html; charset=utf-8', png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', webm: 'video/webm' };
      const size = statSync(file).size;
      res.setHeader('Content-Type', types[file.split('.').pop()!.toLowerCase()] || 'application/octet-stream');
      res.setHeader('Accept-Ranges', 'bytes');
      const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
      if (m) {
        const start = m[1] ? +m[1] : 0, end = m[2] ? +m[2] : size - 1;
        res.statusCode = 206;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
        res.setHeader('Content-Length', end - start + 1);
        return createReadStream(file, { start, end }).pipe(res);
      }
      res.setHeader('Content-Length', size);
      createReadStream(file).pipe(res);
    });
  },
});

// Antes de compilar, borra solo la carpeta /assets vieja (para no acumular archivos con hash viejos).
const cleanOldAssets = (): Plugin => ({
  name: 'clean-old-assets',
  apply: 'build',
  buildStart() { rmSync(resolve(ROOT, 'assets'), { recursive: true, force: true }); },
});

export default defineConfig({
  plugins: [react(), serveRepoFiles(), cleanOldAssets()],
  publicDir: false,
  build: {
    outDir: ROOT,
    emptyOutDir: false, // ¡no borrar el resto del repo!
    assetsDir: 'assets',
  },
});
