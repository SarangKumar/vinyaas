export function DocsFeatureCard() {
  return (
    <div
      data-docs-feature-card
      className="border-border/80 bg-secondary/70 hover:bg-secondary rounded-md border p-3 transition-colors"
    >
      <p className="text-foreground text-[calc(0.875rem+2px)] leading-snug font-semibold">
        What&apos;s new
      </p>
      <p className="text-muted-foreground mt-1.5 text-sm leading-snug">
        Build richer interfaces with the latest Vinyaas components.
      </p>
    </div>
  );
}
