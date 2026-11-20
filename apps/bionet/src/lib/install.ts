/**
 * The one thing on the install page a build can hold: that it sends people to the right repository.
 *
 * The rest of that page — the commands, the sizes, what the first run asks — cannot be checked from
 * here. It was checked the only way it can be, by doing it on a fresh clone before it was written
 * down, and the page says when. What a build *can* catch is the address drifting from the one the
 * rest of the site links to, which is the sort of thing that goes wrong quietly.
 */
import { LINKS } from "@libsbio/shared";
import { STEPS } from "../../content/install.ts";

/**
 * @returns Every disagreement found, as sentences. Empty when the page is telling the truth.
 */
export function check(): string[] {
  const problems: string[] = [];
  const cloning = STEPS.find((step) => step.command.startsWith("git clone"));
  if (cloning === undefined) problems.push("The install page never tells anybody to clone anything.");
  else if (!cloning.command.includes(LINKS.desktop)) {
    problems.push(`The install page clones from somewhere other than ${LINKS.desktop}, which is where the rest of the site points.`);
  }
  return problems;
}

const problems = check();
if (problems.length > 0) throw new Error(`The install page disagrees with the site:\n  ${problems.join("\n  ")}`);
