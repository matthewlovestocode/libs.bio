/**
 * How settled something is.
 *
 * The projects are still being built, and people will try whatever is on the page. So every tool
 * and package says which of these it is. The words shown for each are in a site's messages.
 */

/** Every status, most settled first. */
export const STATUSES = ["stable", "moving"] as const;

/**
 * `stable`: it does what it says and is not expected to change underneath you.
 * `moving`: it works, and may change.
 */
export type Status = (typeof STATUSES)[number];
