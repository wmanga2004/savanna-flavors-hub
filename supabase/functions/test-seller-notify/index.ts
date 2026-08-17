import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function env(name: string) {
  const raw = Deno.env.get(name)?.trim();
  if (!raw) return "";
  return raw.replace(/^["']|["']$/g, "").trim();
}

function toE164(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+") && cleaned.length >= 11) return cleaned;
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return cleaned.startsWith("+") ? cleaned : digits ? `+${digits}` : "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const sid = env("TWILIO_ACCOUNT_SID");
    const token = env("TWILIO_AUTH_TOKEN");
    const from = toE164(env("TWILIO_FROM_NUMBER"));
    const to = toE164(env("SELLER_PHONE") || "+14054762965");

    const diagnostics = {
      twilio: {
        hasSid: Boolean(sid),
        sidPrefix: sid.slice(0, 2),
        hasToken: Boolean(token),
        from,
        to,
      },
    };

    let sms: { sent: boolean; reason?: string } = { sent: false, reason: "not_attempted" };

    if (!sid || !token || !from || !to) {
      sms = {
        sent: false,
        reason: `missing_twilio_config sid=${Boolean(sid)} token=${Boolean(token)} from=${from || "empty"} to=${to || "empty"}`,
      };
    } else {
      const auth = btoa(`${sid}:${token}`);
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          // Trial accounts require a predefined template name as Body.
          body: new URLSearchParams({
            To: to,
            From: from,
            Body: "sms_order_confirmation",
          }),
        },
      );
      if (!response.ok) {
        sms = { sent: false, reason: (await response.text()).slice(0, 400) };
      } else {
        sms = { sent: true };
      }
    }

    return new Response(JSON.stringify({ ok: true, diagnostics, sms }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "test failed";
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
