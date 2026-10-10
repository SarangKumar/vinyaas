// Alias for the common llms.txt filename; same content as /llm.txt.
// Route segment config must be a literal in each route file, not re-exported.
export const dynamic = "force-static";

export { GET } from "../llm.txt/route";
