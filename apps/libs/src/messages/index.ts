/**
 * The words the interface itself shows, by language.
 *
 * A component never has text written into it. It asks for `messages(language)` and shows what it is
 * given, so adding a language is adding one file beside `en.ts` and naming it here.
 */
import { DEFAULT_LANGUAGE, type Language } from "@libsbio/shared";
import { en } from "./en.ts";

/** Everything the interface says, in one language. */
export type Messages = typeof en;

const ALL: Record<Language, Messages> = { en };

/**
 * @param language - The language wanted.
 * @returns The interface's words in it.
 */
export function messages(language: Language = DEFAULT_LANGUAGE): Messages {
  return ALL[language];
}
