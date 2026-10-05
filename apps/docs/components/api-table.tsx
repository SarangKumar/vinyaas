export type ApiRow = {
  prop: string;
  type: string;
  defaultValue?: string;
  description: string;
};

export function ApiTable({ rows }: { rows: ApiRow[] }) {
  return (
    <div className="border-border overflow-x-auto rounded-md border">
      <table className="text-foreground w-full min-w-[36rem] border-collapse text-left text-base leading-7">
        <thead>
          <tr className="border-border border-b">
            <th className="text-foreground px-3 py-2 font-medium">Prop</th>
            <th className="text-foreground px-3 py-2 font-medium">Type</th>
            <th className="text-foreground px-3 py-2 font-medium">Default</th>
            <th className="text-foreground px-3 py-2 font-medium">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.prop}
              className="border-border border-b last:border-b-0"
            >
              <th className="text-foreground px-3 py-2.5 align-top font-normal">
                <code>{row.prop}</code>
              </th>
              <td className="text-foreground px-3 py-2.5 align-top">
                <code>{row.type}</code>
              </td>
              <td className="text-foreground px-3 py-2.5 align-top">
                {row.defaultValue ? <code>{row.defaultValue}</code> : "—"}
              </td>
              <td className="text-foreground px-3 py-2.5 align-top">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
