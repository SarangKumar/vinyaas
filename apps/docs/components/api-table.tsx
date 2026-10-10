export type ApiRow = {
  prop: string;
  type: string;
  defaultValue?: string;
  /** Kept for authoring convenience; not shown in the table. */
  description?: string;
};

/**
 * Documentation API / props table.
 * Width ownership: this renderer + `#docs-content table { width: 100% }` —
 * not the shared Table primitive (homepage / product tables stay unchanged).
 */
export function ApiTable({ rows }: { rows: ApiRow[] }) {
  return (
    <div
      data-api-table=""
      className="border-border w-full min-w-0 overflow-x-auto rounded-md border"
    >
      <table className="text-foreground w-full table-fixed border-collapse text-left text-base leading-7">
        <colgroup>
          <col className="w-[28%]" />
          <col className="w-[44%]" />
          <col className="w-[28%]" />
        </colgroup>
        <thead>
          <tr className="border-border border-b">
            <th className="text-foreground px-3 py-2 font-medium">Prop</th>
            <th className="text-foreground px-3 py-2 font-medium">Type</th>
            <th className="text-foreground px-3 py-2 font-medium">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              // The same prop can appear for two parts (e.g. ToggleGroup and
              // ToggleGroupItem both take `value`), so the name alone is not unique.
              key={`${row.prop}-${index}`}
              className="border-border border-b last:border-b-0"
            >
              <th className="text-foreground px-3 py-2.5 align-top font-normal break-words">
                <code>{row.prop}</code>
              </th>
              <td className="text-foreground px-3 py-2.5 align-top break-words">
                <code>{row.type}</code>
              </td>
              <td className="text-foreground px-3 py-2.5 align-top break-words">
                {row.defaultValue ? <code>{row.defaultValue}</code> : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
