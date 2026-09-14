import { buildProfileLines } from "@/app/lib/profileDocument";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildProfileLines().join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
