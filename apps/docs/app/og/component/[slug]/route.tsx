import { components } from "@/components/component-meta";
import { componentOgImage, findComponent } from "@/lib/og";

export const runtime = "edge";

export function generateStaticParams() {
  return components.map((component) => ({ slug: component.slug }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const component = findComponent(slug);

  if (!component) {
    return new Response("Component not found", { status: 404 });
  }

  return componentOgImage(component);
}
