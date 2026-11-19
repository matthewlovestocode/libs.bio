import type { Metadata } from "next";
import { LINKS } from "@libsbio/shared";
import { candidates, chosen } from "../../../../../content/papers/digests.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.digests.title}: ${text.views.read}` };

/** Read: the papers behind the method. Until they are chosen and checked, it says so. */
export default function Read() {
  return (
    <div className="flat">
      <h2>{text.read.heading}</h2>
      {chosen ? null : (
        <div className="notice" role="note">
          <b>{text.read.shortlistTitle}</b> {text.read.shortlistBody}
        </div>
      )}
      <ul className="papers">
        {candidates.map((paper) => (
          <li key={paper.what}>
            <span className="paper-what">{paper.what}</span>
            <span className="tag tag-unknown">{text.read.unknown}</span>
            <span className="quiet">{paper.why}</span>
          </li>
        ))}
      </ul>
      <p className="quiet"><a href={`${LINKS.source}/issues`}>{text.read.suggest}</a></p>
    </div>
  );
}
