export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") return new Response(null, {headers:cors});
    if (request.method !== "POST") return new Response("Method not allowed", {status:405,headers:cors});

    try {
      const { choice } = await request.json();
      const labels = {
        si: "❤️ SÍ, VOLVAMOS",
        pensarlo: "💭 DÉJAME PENSARLO"
      };
      if (!labels[choice]) return new Response("Invalid choice", {status:400,headers:cors});

      const now = new Date().toLocaleString("es-BO", {
        timeZone: "America/La_Paz",
        dateStyle: "short",
        timeStyle: "medium"
      });

      const text = `💌 <b>VOLVAMOS A ELEGIRNOS</b>\n\nElla eligió: <b>${labels[choice]}</b>\n🕐 ${now}`;

      const r = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            chat_id: "1122327197",
            text,
            parse_mode: "HTML"
          })
        }
      );

      return new Response(JSON.stringify({ok:r.ok}), {
        status:r.ok ? 200 : 502,
        headers:{"Content-Type":"application/json",...cors}
      });
    } catch {
      return new Response(JSON.stringify({ok:false}), {
        status:400, headers:{"Content-Type":"application/json",...cors}
      });
    }
  }
};
