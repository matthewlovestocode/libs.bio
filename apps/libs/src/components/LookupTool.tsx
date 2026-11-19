"use client";

import { useState } from "react";
import { type Article, type Articles, type Paper, type Protein, type Records, lookUpProtein, readPaper, searchPapers, searchRecords } from "@/lib/lookup.ts";
import { messages } from "@/messages/index.ts";

/** Which service is being asked. */
type Where = "ncbi" | "uniprot" | "papers";

/** How many results to bring back from a search. */
const MOST = 10;

/** What each box starts with, so the first press gives a real answer. */
const EXAMPLES: Record<Where, string> = { ncbi: "pUC19[title]", uniprot: "P02666", papers: 'TITLE:"sequence logos" AND AUTH:"Schneider"' };

/**
 * The lookup tool: one question to one of three public services, asked by the visitor's own browser.
 *
 * Nothing passes through this site, which has no server to pass it through. Each service sees the
 * query it was given and nothing else about the visitor.
 */
export function LookupTool() {
  const all = messages();
  const text = all.lookup;
  const [where, setWhere] = useState<Where>("ncbi");
  const [query, setQuery] = useState(EXAMPLES.ncbi);
  const [database, setDatabase] = useState("nucleotide");
  const [asking, setAsking] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [records, setRecords] = useState<Records | null>(null);
  const [protein, setProtein] = useState<Protein | null>(null);
  const [articles, setArticles] = useState<Articles | null>(null);
  const [paper, setPaper] = useState<Paper | null>(null);
  const number = (value: number) => value.toLocaleString("en-US");

  const switchTo = (next: Where) => {
    setWhere(next);
    setQuery(EXAMPLES[next]);
    setProblem(null); setRecords(null); setProtein(null); setArticles(null); setPaper(null);
  };

  const ask = async () => {
    if (asking || query.trim() === "") return;
    setAsking(true); setProblem(null); setPaper(null);
    try {
      if (where === "ncbi") { setProtein(null); setArticles(null); setRecords(await searchRecords(query, database, MOST)); }
      else if (where === "uniprot") { setRecords(null); setArticles(null); setProtein(await lookUpProtein(query)); }
      else { setRecords(null); setProtein(null); setArticles(await searchPapers(query, MOST)); }
    } catch (error) {
      setProblem(error instanceof Error ? error.message : String(error));
    } finally {
      setAsking(false);
    }
  };

  const read = async (article: Article) => {
    if (article.pmcid === null || asking) return;
    setAsking(true); setProblem(null);
    try { setPaper(await readPaper(article.pmcid)); }
    catch (error) { setProblem(`${text.cannotRead} ${error instanceof Error ? error.message : String(error)}`); }
    finally { setAsking(false); }
  };

  return (
    <>
      <div className="methods" role="group" aria-label={text.whereToAsk}>
        {(["ncbi", "uniprot", "papers"] as const).map((one) => (
          <button key={one} type="button" className={`chip${where === one ? " on" : ""}`} aria-pressed={where === one} onClick={() => switchTo(one)}>
            {text.services[one]}
          </button>
        ))}
        <span className="quiet">{text.serviceNote[where]}</span>
      </div>

      <div className="tool align-tool">
        <section className="glass">
          <h2>{text.askHeading(text.services[where])}</h2>
          {where === "ncbi" ? (
            <div className="row">
              <label className="field" htmlFor="database">{text.database}</label>
              <select id="database" className="in" value={database} onChange={(event) => setDatabase(event.target.value)}>
                <option value="nucleotide">{text.nucleotide}</option>
                <option value="protein">{text.proteinDb}</option>
              </select>
            </div>
          ) : null}
          <label className="field" htmlFor="query">{where === "uniprot" ? text.accession : text.query}</label>
          <div className="row">
            <input id="query" className="in grow" value={query} onChange={(event) => setQuery(event.target.value)}
                   onKeyDown={(event) => { if (event.key === "Enter") void ask(); }} spellCheck={false} />
            <button type="button" className="btn" onClick={() => void ask()} disabled={asking}>{asking ? text.asking : text.ask}</button>
          </div>
          <p className="quiet">{text.syntax[where]}</p>
          {problem !== null ? <p className="problem" role="alert">{problem}</p> : null}
          <p className="quiet">{text.whatIsSent(text.services[where])}</p>
        </section>

        <section className="glass" aria-live="polite">
          {records === null && protein === null && articles === null ? (
            <><h2>{text.nothingYet}</h2><p className="quiet">{text.nothingYetNote}</p></>
          ) : records !== null ? (
            <>
              <h2>{text.matched(number(records.matched))}</h2>
              {records.records.length === 0 ? <p className="quiet">{text.nothingMatched}</p> : (
                <div className="tables">
                  <table>
                    <thead><tr><th>{text.accessionColumn}</th><th>{text.whatItIs}</th><th>{text.length}</th></tr></thead>
                    <tbody>
                      {records.records.map((one) => (
                        <tr key={one.accession}>
                          <td className="n">{one.accession}</td>
                          <td className="wrap">{one.title}{one.organism === "" ? null : <span className="quiet"> {one.organism}</span>}</td>
                          <td className="n">{one.length === null ? "—" : `${number(one.length)} bp`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="quiet">{text.recordsNote(number(records.matched), MOST)}</p>
            </>
          ) : protein !== null ? (
            <>
              <h2>{protein.name}</h2>
              <p className="facts">
                <span><b>{text.accessionColumn}</b> {protein.accession}</span>
                {protein.gene === "" ? null : <span><b>{text.gene}</b> {protein.gene}</span>}
                {protein.organism === "" ? null : <span><b>{text.organism}</b> {protein.organism}</span>}
              </p>
              <p className="facts">
                <span className={protein.reviewed ? undefined : "warn"}><b>{text.reviewed}</b> {protein.reviewed ? text.byAPerson : text.byMachine}</span>
                <span><b>{text.asMade}</b> {number(protein.length)} {text.residues}</span>
                {protein.chainLength === null ? null : <span><b>{text.whatALabHolds}</b> {number(protein.chainLength)} {text.residues}</span>}
                {protein.signal === null ? null : <span><b>{text.signal}</b> {protein.signal.from}–{protein.signal.to}</span>}
              </p>
              <p className="quiet">{protein.reviewed ? text.reviewedNote : text.unreviewedNote}</p>
              {protein.modifications.length === 0 ? <p className="quiet">{text.noModifications}</p> : (
                <>
                  <h3>{text.modifications(protein.modifications.length)}</h3>
                  <div className="tables">
                    <table>
                      <thead><tr><th>{text.asMadeShort}</th><th>{text.onTheChain}</th><th>{text.whatItIs}</th></tr></thead>
                      <tbody>
                        {protein.modifications.slice(0, 20).map((one, at) => (
                          <tr key={at}>
                            <td className="n">{one.at}</td>
                            <td className="n">{one.onChain === null ? "—" : one.onChain}</td>
                            <td className="wrap">{one.what}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="quiet">{text.numberingNote}</p>
                </>
              )}
            </>
          ) : articles !== null ? (
            <>
              <h2>{text.matched(number(articles.matched))}</h2>
              {articles.articles.length === 0 ? <p className="quiet">{text.nothingMatched}</p> : (
                <ul className="papers-found">
                  {articles.articles.map((one) => (
                    <li key={one.pmid || one.doi || one.title}>
                      <span className="paper-title">{one.title}</span>
                      <span className="quiet">{one.authors}{one.journal === "" ? "" : `. ${one.journal}`}{one.year === "" ? "" : `, ${one.year}`}.</span>
                      <span className="paper-links">
                        <span className={`tag tag-${one.openAccess ? "open" : "paywalled"}`}>{one.openAccess ? text.openAccess : text.notOpen}</span>
                        {one.fullText && one.pmcid !== null
                          ? <button type="button" className="link-button" onClick={() => void read(one)} disabled={asking}>{text.readHere}</button>
                          : <span className="quiet">{text.abstractOnly}</span>}
                        {one.pmid === "" ? null : <a href={`https://europepmc.org/article/MED/${one.pmid}`}>{all.read.record}</a>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="quiet">{text.openVersusFull}</p>
              {paper === null ? null : (
                <>
                  <h3>{paper.title}</h3>
                  <p className="facts">
                    <span><b>{text.sections}</b> {number(paper.sections.length)}</span>
                    <span><b>{text.tables}</b> {number(paper.tables)}</span>
                    {paper.licence === null ? null : <span><b>{text.licence}</b> <a href={paper.licence}>{text.theLicence}</a></span>}
                  </p>
                  <div className="paper-text">
                    {paper.sections.slice(0, 6).map((section, at) => (
                      <div key={at}>
                        <h4>{section.heading === "" ? text.untitled : section.heading}</h4>
                        <p>{section.text.length > 700 ? `${section.text.slice(0, 700)}…` : section.text}</p>
                      </div>
                    ))}
                  </div>
                  <p className="quiet">{text.paperNote(number(paper.sections.length))}</p>
                </>
              )}
            </>
          ) : null}
        </section>
      </div>
    </>
  );
}
