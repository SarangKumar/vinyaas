import { PlayBlock } from "@/app/home/play-block";
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar";
import { Badge } from "@/registry/new-york/ui/badge";
import { Separator } from "@/registry/new-york/ui/separator";

const events = [
  {
    time: "09:30",
    title: "Production deploy finished",
    who: "Rahul Mehta",
    initials: "RM",
    state: "Deploy",
  },
  {
    time: "11:00",
    title: "Invoice #INV-2048 paid",
    who: "Priya Shah",
    initials: "PS",
    state: "Payment",
  },
  {
    time: "14:20",
    title: "Profile name updated",
    who: "Ada Lovelace",
    initials: "AL",
    state: "Profile",
  },
  {
    time: "16:15",
    title: "New sign-in from Chrome",
    who: "Security",
    initials: "SE",
    state: "Security",
  },
];

export function ScheduleBlock() {
  return (
    <PlayBlock title="Activity" description="Recent workspace events.">
      <ul className="flex min-w-0 flex-col gap-4">
        {events.map((event, index) => (
          <li key={event.time} className="min-w-0">
            {index > 0 ? <Separator className="mb-4" /> : null}
            <div className="flex min-w-0 items-start gap-3">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback>{event.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium">{event.title}</p>
                  <Badge variant="outline">{event.state}</Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {event.who} · {event.time}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </PlayBlock>
  );
}
