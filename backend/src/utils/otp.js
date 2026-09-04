 export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOtp(email, code) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "E-connect <onboarding@resend.dev>";

  if (!apiKey) {
    // Fallback for local dev if no key is set yet
    console.log(`[MOCK EMAIL OTP] Code ${code} for ${email}`);
    return true;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Your E-connect verification code",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color:#241C5E;">E-connect</h2>
          <p>Your verification code is:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color:#241C5E;">${code}</p>
          <p style="color:#666; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Resend email failed:", errText);
    throw new Error("Failed to send verification email");
  }

  return true;
}