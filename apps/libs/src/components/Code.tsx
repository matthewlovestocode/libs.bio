import { type Highlighter, createHighlighter } from "shiki";

/**
 * Code, coloured for reading.
 *
 * The colouring is done when the site is built, by Shiki, and what reaches the browser is plain
 * HTML: no script runs to colour anything. Each token carries a colour for the light theme and one
 * for the dark, and the stylesheet picks between them the way it does for everything else.
 */

/** The languages there is code in. */
export type Language = "ts" | "bash";

let ready: Promise<Highlighter> | null = null;

/** One highlighter for the whole build. Making it is the slow part, so it is made once. */
const highlighter = () => (ready ??= createHighlighter({ themes: ["github-light", "github-dark-dimmed"], langs: ["ts", "bash"] }));

/**
 * @param props.code - The code.
 * @param props.language - What it is written in. TypeScript unless said otherwise.
 * @param props.className - Extra classes for the block, such as `signature`.
 */
export async function Code({ code, language = "ts", className }: { code: string; language?: Language; className?: string }) {
  const html = (await highlighter()).codeToHtml(code, {
    lang: language,
    themes: { light: "github-light", dark: "github-dark-dimmed" },
    // Neither theme's colour is written in as the default: both travel as variables.
    defaultColor: false,
    // The block keeps this site's own background and border, not the theme's.
    transformers: [{ pre(node) { delete node.properties.style; delete node.properties.tabindex; node.properties.class = `code${className === undefined ? "" : ` ${className}`}`; } }],
  });
  return <div className="code-block" dangerouslySetInnerHTML={{ __html: html }} />;
}
