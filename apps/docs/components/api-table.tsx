export type ApiRow = {
  prop: string;
  type: string;
  defaultValue?: string;
  description?: string;
};

const codePill =
  "bg-secondary text-foreground inline-block rounded-md px-1.5 py-0.5 font-mono text-xs leading-5";

/**
 * Documentation API / props table.
 * Width ownership: this renderer + `#docs-content table { width: 100% }` —
 * not the shared Table primitive (homepage / product tables stay unchanged).
 */
export function ApiTable({ rows }: { rows: ApiRow[] }) {
  const hasDescriptions = rows.some((row) => row.description);

  return (
    <div
      data-api-table=""
      className="border-border bg-background w-full min-w-0 overflow-x-auto rounded-3xl border"
    >
      <table className="text-foreground w-full table-fixed border-collapse text-left text-sm">
        <colgroup>
          {hasDescriptions ? (
            <>
              <col className="w-[18%]" />
              <col className="w-[22%]" />
              <col className="w-[15%]" />
              <col className="w-[45%]" />
            </>
          ) : (
            <>
              <col className="w-[28%]" />
              <col className="w-[44%]" />
              <col className="w-[28%]" />
            </>
          )}
        </colgroup>
        <thead>
          <tr className="border-border/50 bg-card border-b">
            <th className="text-muted-foreground px-4 py-3.5 text-xs font-medium tracking-widest uppercase">
              Name
            </th>
            <th className="text-muted-foreground px-4 py-3.5 text-xs font-medium tracking-widest uppercase">
              Type
            </th>
            <th className="text-muted-foreground px-4 py-3.5 text-xs font-medium tracking-widest uppercase">
              Default
            </th>
            {hasDescriptions ? (
              <th className="text-muted-foreground px-4 py-3.5 text-xs font-medium tracking-widest uppercase">
                Description
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              // The same prop can appear for two parts (e.g. ToggleGroup and
              // ToggleGroupItem both take `value`), so the name alone is not unique.
              key={`${row.prop}-${index}`}
              className="border-border/40 border-b last:border-b-0"
            >
              <th className="text-foreground px-4 py-3.5 align-middle font-normal break-words">
                <code className={codePill}>{row.prop}</code>
              </th>
              <td className="text-muted-foreground px-4 py-3.5 align-middle break-words">
                {row.type}
              </td>
              <td className="text-foreground px-4 py-3.5 align-middle break-words">
                {row.defaultValue ? (
                  <code className={codePill}>{row.defaultValue}</code>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              {hasDescriptions ? (
                <td className="text-muted-foreground px-4 py-3.5 align-middle break-words">
                  {row.description ?? ""}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
