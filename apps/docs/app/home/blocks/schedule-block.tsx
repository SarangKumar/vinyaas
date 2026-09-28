import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge/badge";

const slots = [
  { time: "09:30", title: "Billing review", who: "Priya Shah", state: "Now" },
  { time: "11:00", title: "Deploy window", who: "Rahul Mehta", state: "Next" },
  {
    time: "16:15",
    title: "Notes sync",
    who: "Ada Lovelace",
    state: "Optional",
  },
];

export function ScheduleBlock() {
  return (
    <PlayBlock title="Today">
      <ul className="grid gap-3">
        {slots.map((slot) => (
          <li key={slot.time} className="flex min-w-0 items-start gap-3">
            <span className="text-muted-foreground w-12 shrink-0 pt-0.5 font-mono text-xs">
              {slot.time}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{slot.title}</p>
              <p className="text-muted-foreground truncate text-xs">
                {slot.who}
              </p>
            </div>
            <Badge variant="secondary">{slot.state}</Badge>
          </li>
        ))}
      </ul>
    </PlayBlock>
  );
}
