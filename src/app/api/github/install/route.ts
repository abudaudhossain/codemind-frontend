import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json(
      { message: "Authentication is required before connecting GitHub." },
      { status: 401 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/github/install`, {
    headers: { Authorization: authorization },
    redirect: "manual",
    cache: "no-store",
  });

  if (response.status < 300 || response.status >= 400) {
    const body = await response.text();
    return new NextResponse(body || "Unable to start GitHub installation.", {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "text/plain",
      },
    });
  }

  const location = response.headers.get("location");
  if (!location) {
    return NextResponse.json(
      { message: "The GitHub installation redirect was not provided." },
      { status: 502 }
    );
  }

  return NextResponse.json({ location });
}
