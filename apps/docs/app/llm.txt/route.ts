import { buildLlmsTxt } from "@/lib/llms";

// Generated at build time and served from the CDN like the static pages.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
