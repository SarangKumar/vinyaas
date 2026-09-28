import { PlayBlock } from "@/app/home/play-block";

const planning = [
  { label: "Documents", hint: "Specs & briefs" },
  { label: "Budget", hint: "Spend tracker" },
  { label: "Roadmap", hint: "Q3 milestones" },
  { label: "Meetings", hint: "Weekly sync" },
];

const support = [
  { label: "Help Center", hint: "Guides" },
  { label: "Docs", hint: "API reference" },
  { label: "Community", hint: "Discord" },
  { label: "Status", hint: "All systems" },
];

function NavColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; hint: string }[];
}) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
        {title}
      </p>
      <ul className="grid gap-1">
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              className="hover:bg-muted flex w-full min-w-0 items-center gap-3 rounded-md px-2 py-2 text-left"
            >
              <span
                aria-hidden="true"
                className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-medium"
              >
                {item.label.slice(0, 1)}
              </span>
              <span className="min-w-0">
                <span className="text-foreground block truncate text-sm font-medium">
                  {item.label}
                </span>
                <span className="text-muted-foreground block truncate text-xs">
                  {item.hint}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WorkspaceNavBlock() {
  return (
    <PlayBlock>
      <div className="grid min-w-0 grid-cols-2 gap-4">
        <NavColumn title="Planning" items={planning} />
        <NavColumn title="Support" items={support} />
      </div>
    </PlayBlock>
  );
}
