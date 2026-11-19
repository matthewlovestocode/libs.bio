/**
 * The languages the sites are written in.
 *
 * Content is in English only for now. Everything is laid out so that a second language is an
 * addition and not a restructuring: text lives in a `messages/<language>.ts` file or a
 * `content/<language>/` folder, never in a component, and a page's address is worked out here.
 */

/** Every language there is content in. The first is the default. */
export const LANGUAGES = ["en"] as const;

/** One of the languages there is content in. */
export type Language = (typeof LANGUAGES)[number];

/** The language a page is in when its address does not say. */
export const DEFAULT_LANGUAGE: Language = LANGUAGES[0];

/**
 * Say whether some text names a language there is content in.
 *
 * @param value - What was read from an address.
 * @returns Whether it is one of `LANGUAGES`.
 */
export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}

/**
 * The address of a page in a language.
 *
 * The default language has no prefix, so English addresses stay short and a link written today
 * keeps working when another language arrives. Every other language is under its own code.
 *
 * @param path - The page's address in the default language, starting with `/`.
 * @param language - The language wanted.
 * @returns The address of that page in that language.
 *
 * @example
 * ```ts
 * pathIn("/topics/digests", "en");   // "/topics/digests"
 * ```
 */
export function pathIn(path: string, language: Language = DEFAULT_LANGUAGE): string {
  if (!path.startsWith("/")) throw new Error(`A page's address starts with "/": ${path}`);
  if (language === DEFAULT_LANGUAGE) return path;
  return path === "/" ? `/${language}` : `/${language}${path}`;
}
