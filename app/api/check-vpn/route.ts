import { headers, cookies } from "next/headers";

export const revalidate = 0; // we control caching manually

export async function GET() {
  const h = headers();
  const cookieStore = cookies();

  // 1️⃣ Get real IP
  const ip =
    (await h).get("x-forwarded-for")?.split(",")[0] ||
    (await h).get("x-real-ip");

  if (!ip) {
    return Response.json({ isVpn: false });
  }

  console.log("aaaaaaaaaaa", ip);
  // 2️⃣ Read last saved IP & data from cookies
  const lastIP = (await cookieStore).get("last_ip")?.value;
  const cached = (await cookieStore).get("ipinfo_cache")?.value;

  console.log("bbbbbbbbb", lastIP, ip, cached);
  // 3️⃣ If IP unchanged → return cached result
  // if (lastIP === ip && cached) {
  //   return Response.json(JSON.parse(cached));
  // }

  // 4️⃣ IP changed → call ipinfo
  const res = await fetch(
    `https://api.ipinfo.io/lite/${ip}?token=${process.env.IPINFO_TOKEN}`
  );
  console.log(
    "444444444",
    `https://ipinfo.io/lite/${ip}?token=${process.env.IPINFO_TOKEN}`
  );

  if (!res.ok) {
    return Response.json({ isVpn: false });
  }

  const data = await res.json();

  // 5️⃣ Iran-specific VPN heuristic
  console.log("sssssssssssssss", data);
  const hostingASNs = [
    "Amazon",
    "Google",
    "OVH",
    "Hetzner",
    "DigitalOcean",
    "Microsoft",
    "M247",
    "Leaseweb",
  ];

  const isHostingASN = hostingASNs.some((p) =>
    data.org?.toLowerCase().includes(p.toLowerCase())
  );

  const isVpn = data.country !== "IR" || isHostingASN || ip.includes(":");

  const responseData = {
    ip,
    country: data.country,
    org: data.org,
    isVpn,
  };

  // 6️⃣ Save IP + result in cookies
  (
    await // 6️⃣ Save IP + result in cookies
    cookieStore
  ).set("last_ip", ip, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
  });

  (await cookieStore).set("ipinfo_cache", JSON.stringify(responseData), {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  });

  return Response.json(responseData);
}
