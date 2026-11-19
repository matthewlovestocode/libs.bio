import { Fragment } from "react";
import { Code } from "./Code.tsx";

/**
 * A doc comment's words, drawn. Doc comments are written in a small part of Markdown: paragraphs,
 * lists, `code`, **bold**, *emphasis* and fenced blocks. That part is handled here and nothing else is.
 */

/** One line's `code` and **bold**. */
function inline(text: string): React.ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 1 ? <code key={i}>{part.slice(1, -1)}</code>
      : part.startsWith("**") && part.endsWith("**") && part.length > 3 ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part.startsWith("*") && part.endsWith("*") && part.length > 2 ? <em key={i}>{part.slice(1, -1)}</em>
          : <Fragment key={i}>{part}</Fragment>);
}

/**
 * @param props.text - The words of a doc comment.
 * @param props.brief - Draw only the first paragraph, on one line.
 */
export function DocText({ text, brief = false }: { text: string; brief?: boolean }) {
  if (text === "") return null;
  if (brief) return <>{inline(text.split(/\n\s*\n/)[0].replace(/\s*\n\s*/g, " "))}</>;
  const blocks: React.ReactNode[] = [];
  const parts = text.split(/(```[\s\S]*?```)/g);
  parts.forEach((part, at) => {
    if (part.startsWith("```")) {
      blocks.push(<Code key={at} code={part.replace(/^```\w*\n?/, "").replace(/\n?```$/, "")} language={/^```(bash|sh|shell)/.test(part) ? "bash" : "ts"} />);
      return;
    }
    part.split(/\n\s*\n/).forEach((block, i) => {
      const lines = block.split("\n").filter((line) => line.trim() !== "");
      if (lines.length === 0) return;
      if (lines.every((line) => /^\s*[-*] /.test(line) || /^\s{2,}\S/.test(line))) {
        // A list. A line that is indented and has no marker carries on the item above it.
        const entries: string[] = [];
        for (const line of lines) {
          if (/^\s*[-*] /.test(line)) entries.push(line.replace(/^\s*[-*] /, ""));
          else if (entries.length > 0) entries[entries.length - 1] += ` ${line.trim()}`;
        }
        blocks.push(<ul key={`${at}-${i}`}>{entries.map((entry, n) => <li key={n}>{inline(entry)}</li>)}</ul>);
      } else {
        blocks.push(<p key={`${at}-${i}`}>{inline(lines.join(" "))}</p>);
      }
    });
  });
  return <>{blocks}</>;
}
