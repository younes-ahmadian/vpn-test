// app/api/get-ip/route.ts

export async function GET(request: Request) {
  const headers = request.headers;
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0] ||
    headers.get("x-real-ip") ||
    "Unknown IP";

  return new Response(JSON.stringify({ ip }), { status: 200 });
}
