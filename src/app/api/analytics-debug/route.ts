import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  const b64 = process.env.GOOGLE_CREDENTIALS_BASE64;
  const propertyId = process.env.GA4_PROPERTY_ID;

  const checks: Record<string, string> = {};

  // Check 1: env vars exist
  checks.hasBase64 = b64 ? `yes (${b64.length} chars)` : "MISSING";
  checks.hasPropertyId = propertyId || "MISSING";

  if (!b64) {
    return NextResponse.json(checks);
  }

  // Check 2: base64 decode
  let decoded: string;
  try {
    decoded = Buffer.from(b64, "base64").toString("utf-8");
    checks.base64Decode = `ok (${decoded.length} chars)`;
  } catch (e) {
    checks.base64Decode = `FAILED: ${e instanceof Error ? e.message : String(e)}`;
    return NextResponse.json(checks);
  }

  // Check 3: JSON parse
  let credentials: Record<string, string>;
  try {
    credentials = JSON.parse(decoded);
    checks.jsonParse = "ok";
    checks.hasClientEmail = credentials.client_email ? "yes" : "MISSING";
    checks.hasPrivateKey = credentials.private_key ? `yes (${credentials.private_key.length} chars)` : "MISSING";
    checks.keyStartsWith = credentials.private_key?.substring(0, 31) || "N/A";
    checks.keyEndsWith = credentials.private_key?.substring(credentials.private_key.length - 30) || "N/A";
  } catch (e) {
    checks.jsonParse = `FAILED: ${e instanceof Error ? e.message : String(e)}`;
    checks.decodedPreview = decoded.substring(0, 100);
    return NextResponse.json(checks);
  }

  // Check 4: try to get an auth token
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    checks.auth = token ? "ok - got access token" : "no token returned";
  } catch (e) {
    checks.auth = `FAILED: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(checks);
}
