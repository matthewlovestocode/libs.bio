import type { Metadata } from "next";
import { LINKS } from "@libsbio/shared";
import { checked, chosen, papers } from "../../../../../content/papers/digests.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: `${text.topics.digests.title}: ${text.views.read}` };

/**
 * Read: the papers behind the method.
 *
 * Most readers here have no journal subscription, so each paper says how it can be got at, and the
 * first link goes to the free full text when there is one.
 */
export default function Read() {
  return (
    <div className="flat">
      <h2>{text.read.heading}</h2>
      {chosen ? null : (
        <div className="notice" role="note">
          <b>{text.read.shortlistTitle}</b> {text.read.shortlistBody(checked)}
        </div>
      )}
      <ul className="papers">
        {papers.map((paper) => (
          <li key={paper.pmid}>
            <span className="paper-what">{paper.title}</span>
            <span className={`tag tag-${paper.access}`} title={text.read.accessNote[paper.access]}>{text.read.access[paper.access]}</span>
            <span className="quiet">{paper.authors}. {paper.journal}, {paper.year}.</span>
            <span className="quiet">{paper.why}</span>
            <span className="paper-links">
              {paper.pmcid === null ? null : <a href={`https://europepmc.org/article/PMC/${paper.pmcid}`}>{text.read.readIt}</a>}
              <a href={`https://doi.org/${paper.doi}`}>{text.read.publisher}</a>
              <a href={`https://europepmc.org/article/MED/${paper.pmid}`}>{text.read.record}</a>
            </span>
          </li>
        ))}
      </ul>
      <p className="quiet">{chosen ? `${text.read.checked(checked)} ` : null}<a href={`${LINKS.source}/issues`}>{text.read.suggest}</a></p>
    </div>
  );
}
