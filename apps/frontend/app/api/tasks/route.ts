import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api-proxy";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const path = `/tasks/${query ? `?${query}` : ""}`;
  return proxyToBackend(request, path);
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, "/tasks/");
}
