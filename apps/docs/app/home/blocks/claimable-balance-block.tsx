import { PlayBlock } from "@/app/home/play-block";
import { Badge } from "@/registry/new-york/ui/badge/badge";

export function ClaimableBalanceBlock() {
  return (
    <PlayBlock title="Claimable Balance">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-foreground text-3xl font-semibold tracking-tight">
            $1,211.29
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Available after payout clears
          </p>
        </div>
        <Badge variant="secondary">Pending Setup</Badge>
      </div>
    </PlayBlock>
  );
}
