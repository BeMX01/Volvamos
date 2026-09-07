# Configuración de Telegram ❤️

1. Crea un Cloudflare Worker.
2. Pega el contenido de `worker.js`.
3. En Variables/Secrets del Worker crea `TELEGRAM_BOT_TOKEN` con el token de BotFather.
4. Despliega el Worker y copia su URL.
5. En `script.js`, cambia `const TELEGRAM_ENDPOINT = "";` por la URL del Worker.
6. Sube `index.html`, `style.css`, `script.js` y `musica.mp3` a GitHub Pages.

Nunca pongas el token de Telegram dentro de GitHub Pages.
El chat_id ya está configurado para recibir tus notificaciones.
