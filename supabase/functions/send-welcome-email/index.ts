import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("🔔 Function invoked - new request received");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("⚙️ CORS preflight request");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("📥 Parsing request body...");
    const payload = await req.json();
    console.log("📦 Received payload:", JSON.stringify(payload, null, 2));
    
    // Handle both webhook format (from Database Webhooks) and direct calls
    let email;
    
    if (payload.type === "INSERT" && payload.record) {
      // Database Webhook format
      email = payload.record.email;
      console.log("📧 Webhook triggered for new email:", email);
    } else if (payload.email) {
      // Direct API call format
      email = payload.email;
      console.log("📧 Direct API call for email:", email);
    } else {
      console.error("❌ Email not found in request payload");
      throw new Error("Email not found in request");
    }

    if (!email) {
      console.error("❌ Email is empty or null");
      throw new Error("Email is required");
    }

    console.log("🔑 Checking for RESEND_API_KEY...");
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("❌ RESEND_API_KEY not found in environment");
      throw new Error("RESEND_API_KEY not configured");
    }
    console.log("✅ RESEND_API_KEY found");

    // Initialize Resend with API key from environment
    console.log("🚀 Initializing Resend client...");
    const resend = new Resend(apiKey);
    console.log("✅ Resend client initialized");

    console.log("📨 Attempting to send email to:", email);
    
    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: "Študko <onboarding@resend.dev>", // Zamenjaj z svojim domenom
      to: [email],
      subject: "🚀 Tvoje VIP mesto v Študku je rezervirano!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6;">Živijo!</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Hvala za prijavo na Študko waiting listo. Rezerviral si si mesto med prvih 50!
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            <b>Se vidimo ob otvoritvi: v nedeljo, 18. 1. ob 15:00.</b>
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 14px; color: #6b7280;">
            Lep pozdrav,<br>
            Ekipa Študko
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend API returned error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw error;
    }

    console.log("✅ Email sent successfully!");
    console.log("📬 Message ID:", data?.id);
    console.log("📧 Sent to:", email);

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id, email }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("💥 ERROR in send-welcome-email function:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", JSON.stringify(error, null, 2));
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
