# Laboratorio 07 – Panel de seguimiento académico (Angular)

Este paquete trae SOLO los archivos que la guía te pide escribir
(`package.json` y todo lo de `src/`). Los archivos generados por Angular CLI
(`angular.json`, `tsconfig*.json`, `public/`) los crea la CLI en tu PC.

## Pasos (en Git Bash o en la terminal de VS Code)

1. Verifica Node.js (la guía usa Node 24 LTS):
   ```bash
   node --version
   npm --version
   ```

2. Crea el proyecto base (en la carpeta donde quieras el laboratorio, por ejemplo
   dentro de `ProyectoGitHub/"Laboratorio 7"`):
   ```bash
   npx -y @angular/cli@22.1.8 new panel-academico --directory lab-semana-07 --standalone --routing=false --style=css --ssr=false --skip-git --package-manager=npm --defaults
   ```

3. Copia encima los archivos de este ZIP:
   - `package.json`  -> reemplaza el de `lab-semana-07/`
   - carpeta `src/` -> reemplaza la `src/` de `lab-semana-07/`

4. Instala dependencias (incluye Bootstrap 5.3.8) y ejecuta:
   ```bash
   cd lab-semana-07
   npm install
   npm start
   ```
   Abre http://localhost:4200

5. Verificación final:
   ```bash
   npm run verify
   ```
   Debe compilar y pasar 4 pruebas.

## Para subirlo a GitHub
Antes del `git add`, asegúrate de tener un `.gitignore` con `node_modules/` y `dist/`
(el proyecto generado por la CLI ya lo trae, pero como usaste `--skip-git` revisa que exista).
