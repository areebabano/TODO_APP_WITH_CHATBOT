import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api-proxy";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(request, `/tasks/${params.id}/complete`);
}
