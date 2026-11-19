# Laboratorio 09 – Portal académico con API REST (Angular)

Este paquete trae los archivos que la guía te pide escribir:
`package.json`, `angular.json`, `tsconfig.json`, `api/`, `scripts/` y todo `src/`.
Los demás (`tsconfig.app.json`, `tsconfig.spec.json`, `public/favicon.ico`) los crea la CLI.

## Pasos

1. Crea el proyecto base (guía, sección 5) en la carpeta donde quieras el laboratorio:
   ```bash
   npx --yes @angular/cli@22.1.8 new portal-rest --standalone --routing --style=css --skip-git --skip-install --ssr=false --defaults
   cd portal-rest
   ```

2. Copia encima los archivos de este ZIP (reemplazando los existentes):
   - `package.json`, `angular.json`, `tsconfig.json`
   - carpetas `api/`, `scripts/` y `src/`
   Conserva `tsconfig.app.json`, `tsconfig.spec.json` y `public/`.

3. Instala dependencias y crea la base de datos de la API:
   ```bash
   npm install
   npm run api:reset
   ```

4. Usa DOS terminales dentro de `portal-rest`:
   - Terminal A: `npm run api`   (API en http://127.0.0.1:3000/estudiantes)
   - Terminal B: `npm start`     (portal en http://localhost:4200)

5. Verificación final (compila y corre las 19 pruebas; la API no hace falta):
   ```bash
   npm run verify
   ```

## Para subirlo a GitHub
Antes del `git add`, verifica que exista `.gitignore` con `node_modules/`, `dist/` y `.angular/`
(la CLI lo crea aunque uses `--skip-git`). No hagas `git add .` hasta comprobarlo.
`api/db.json` puedes subirlo o ignorarlo; se regenera con `npm run api:reset`.
