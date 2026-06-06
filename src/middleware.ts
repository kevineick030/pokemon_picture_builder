import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;

  // No password configured = open access (development default)
  if (!password) return NextResponse.next();

  // Allow through if correct Basic Auth header present
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString();
    const entered = decoded.split(":").slice(1).join(":");
    if (entered === password) return NextResponse.next();
  }

  // Prompt the browser's built-in password dialog
  return new NextResponse("Zugang verweigert", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="My Rookie Card"` },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
