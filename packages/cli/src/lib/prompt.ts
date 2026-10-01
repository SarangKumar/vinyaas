import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export type ConfirmFn = (message: string) => Promise<boolean>;

/**
 * Prompt for yes/no confirmation. Defaults to no on empty input.
 */
export async function confirmPrompt(
  message: string,
  options: {
    input?: NodeJS.ReadableStream;
    output?: NodeJS.WritableStream;
  } = {},
): Promise<boolean> {
  const rl = createInterface({
    input: options.input ?? input,
    output: options.output ?? output,
  });

  try {
    const answer = (await rl.question(`${message} `)).trim().toLowerCase();
    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}
