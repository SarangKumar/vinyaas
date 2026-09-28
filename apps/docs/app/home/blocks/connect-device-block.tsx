import { PlayBlock } from "@/app/home/play-block";

const SIZE = 13;

/**
 * Decorative QR-like matrix for the connect-device composition.
 * Not a real QR code — visual showcase only.
 */
function ConnectMatrix() {
  const cells = Array.from({ length: SIZE * SIZE }, (_, index) => {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const finder =
      (row < 4 && col < 4) ||
      (row < 4 && col > SIZE - 5) ||
      (row > SIZE - 5 && col < 4);
    if (finder) {
      const localRow = row < 4 ? row : row - (SIZE - 4);
      const localCol = col < 4 ? col : col - (SIZE - 4);
      const edge =
        localRow === 0 || localRow === 3 || localCol === 0 || localCol === 3;
      const center =
        localRow === 1 || localRow === 2
          ? localCol === 1 || localCol === 2
          : false;
      return edge || center ? 1 : 0;
    }
    return (row * 3 + col * 5) % 7 < 3 ? 1 : 0;
  });

  return (
    <div
      aria-hidden="true"
      className="border-border bg-background grid aspect-square w-full max-w-[11rem] gap-0.5 rounded-md border p-2"
      style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
    >
      {cells.map((on, index) => (
        <span
          key={index}
          className={on ? "bg-foreground rounded-[1px]" : "bg-transparent"}
        />
      ))}
    </div>
  );
}

export function ConnectDeviceBlock() {
  return (
    <PlayBlock title="Scan to connect">
      <div className="flex flex-col items-center gap-4 py-2">
        <ConnectMatrix />
        <p className="text-muted-foreground max-w-[14rem] text-center text-sm leading-6">
          Open the Vinyaas mobile app and scan to link this workspace.
        </p>
      </div>
    </PlayBlock>
  );
}
