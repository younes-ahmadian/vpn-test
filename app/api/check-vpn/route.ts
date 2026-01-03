// app/api/check-vpn/route.ts

export async function GET() {
  try {
    const ipapiResponse = await fetch("https://ipinfo.io/json"); // Simple public IP service

    console.log("1", ipapiResponse);

    if (!ipapiResponse.ok) {
      console.error("Failed to fetch IP information");
      return new Response(JSON.stringify({ isVpn: false }), { status: 200 });
    }

    const ipData = await ipapiResponse.json();

    console.log("2", ipData);

    // Check if VPN or Proxy is detected
    const isVpn = ipData.security?.vpn || ipData.security?.proxy;

    return new Response(JSON.stringify({ isVpn: Boolean(isVpn) }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching IP details:", error);
    return new Response(JSON.stringify({ isVpn: false }), { status: 200 });
  }
}
