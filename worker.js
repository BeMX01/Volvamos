export default {
  async fetch(request, env) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Permitir solicitudes CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: cors
      });
    }

    // Solo aceptamos POST
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Method not allowed"
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        }
      );
    }

    try {

      // Leer la respuesta enviada por la página
      const data = await request.json();
      const choice = data.choice;

      const labels = {
        si: "❤️ SÍ, VOLVAMOS",
        pensarlo: "💭 DÉJAME PENSARLO"
      };

      // Comprobar respuesta
      if (!labels[choice]) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "Respuesta no válida"
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...cors
            }
          }
        );
      }

      // Fecha y hora de Bolivia
      const now = new Date().toLocaleString("es-BO", {
        timeZone: "America/La_Paz",
        dateStyle: "short",
        timeStyle: "medium"
      });

      // Mensaje que llegará a Telegram
      const text =
        "💌 <b>VOLVAMOS A ELEGIRNOS</b>\n\n" +
        "Ella eligió: <b>" + labels[choice] + "</b>\n" +
        "🕐 " + now;

      // Comprobar que existe el secreto
      if (!env.TELEGRAM_BOT_TOKEN) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "No existe el secreto TELEGRAM_BOT_TOKEN en Cloudflare"
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...cors
            }
          }
        );
      }

      // Enviar mensaje a Telegram
      const telegramResponse = await fetch(
        "https://api.telegram.org/bot" +
        env.TELEGRAM_BOT_TOKEN +
        "/sendMessage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: "1122327197",
            text: text,
            parse_mode: "HTML"
          })
        }
      );

      // Leer respuesta real de Telegram
      const telegramResult = await telegramResponse.json();

      // Si Telegram rechaza la solicitud,
      // devolver el motivo exacto.
      if (!telegramResponse.ok || !telegramResult.ok) {

        return new Response(
          JSON.stringify({
            ok: false,
            telegram_error: telegramResult.description || "Error desconocido",
            telegram_code: telegramResult.error_code || null
          }),
          {
            status: 502,
            headers: {
              "Content-Type": "application/json",
              ...cors
            }
          }
        );
      }

      // Todo correcto
      return new Response(
        JSON.stringify({
          ok: true,
          message: "Mensaje enviado correctamente a Telegram"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({
          ok: false,
          error: "Error interno del Worker"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        }
      );
    }
  }
};