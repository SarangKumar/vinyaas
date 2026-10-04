import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export type ConfirmOptions = {
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
  /** When true, empty input means yes (`[Y/n]`). Default is no (`[y/N]`). */
  defaultYes?: boolean;
};

export type ConfirmFn = (
  message: string,
  options?: ConfirmOptions,
) => Promise<boolean>;

/**
 * Prompt for yes/no confirmation.
 * Defaults to no on empty input unless `defaultYes` is set.
 */
export async function confirmPrompt(
  message: string,
  options: ConfirmOptions = {},
): Promise<boolean> {
  const rl = createInterface({
    input: options.input ?? input,
    output: options.output ?? output,
  });

  try {
    const answer = (await rl.question(`${message} `)).trim().toLowerCase();

    if (answer === "") {
      return options.defaultYes === true;
    }

    if (answer === "y" || answer === "yes") {
      return true;
    }

    if (answer === "n" || answer === "no") {
      return false;
    }

    return options.defaultYes === true;
  } finally {
    rl.close();
  }
}
