// OTP generation + (mocked) delivery. Replace `sendOtp` with a real
// SMS/email provider integration when going to production.
export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOtp(destination, code, channel = "sms") {
  // TODO: integrate a real SMS gateway (e.g. a local Eswatini/SA aggregator) and an email provider.
  console.log(`[MOCK ${channel.toUpperCase()} OTP] Sending code ${code} to ${destination}`);
  return true;
}