# Semana 14 — Consumo de servicios REST en React

Proyecto independiente de la guía de laboratorio 14.

## Requisitos
- Node.js 24 LTS
- Visual Studio Code

## Ejecutar
1. Abre esta carpeta en VS Code.
2. Abre una terminal integrada en la raíz del proyecto.
3. Instala las dependencias:

```bash
npm install
```

4. Abre **dos terminales**:
   - Terminal 1: `npm run api`
   - Terminal 2: `npm run dev`
5. Abre la URL local que indique Vite (normalmente `http://127.0.0.1:5173`).

La API local escucha en `http://127.0.0.1:3001`. Vite reenvía las rutas `/api` mediante el proxy configurado.

## Pruebas y compilación

```bash
npm run verify
```

No mezcles este proyecto con el de la semana 13. La API mantiene los cupos en memoria y se reinicia al apagar el servidor.
