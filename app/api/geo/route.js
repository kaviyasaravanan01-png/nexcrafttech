export async function GET(request) {
  // 1. Try Vercel geo headers (free, automatic on Vercel)
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry"); // Cloudflare fallback

  if (country) {
    return Response.json({ country });
  }

  // 2. Fallback: use free ipapi.co (no key needed, 1k/day)
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : null;

    // Skip localhost/private IPs — they won't resolve to a country
    const isPrivate = !ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.");

    const url = isPrivate
      ? "https://ipapi.co/country/"
      : `https://ipapi.co/${encodeURIComponent(ip)}/country/`;

    const res = await fetch(url, {
      headers: { "User-Agent": "nexcrafttech/1.0" },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const text = (await res.text()).trim();
      // Validate: country codes are exactly 2 uppercase letters
      if (/^[A-Z]{2}$/.test(text)) {
        return Response.json({ country: text });
      }
    }
  } catch {
    // Timeout or network error — default to IN
  }

  // Default to IN (India-first business)
  return Response.json({ country: "IN" });
}
