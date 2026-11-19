import type { Metadata } from "next";
import Link from "next/link";
import { AUTHORITIES, CHECKED, GAPS, LEVELS, QUESTIONS } from "../../../../content/en/safety.ts";
import { messages } from "@/messages/index.ts";

const text = messages();
export const metadata: Metadata = { title: text.topics.safety.title };

/**
 * Do: the one view of this topic that is not a tool, because there is no tool to be had.
 *
 * It asks the questions worth answering and says where each answer actually lives. It does not
 * answer any of them, and says so at the top rather than at the bottom.
 */
export default function Do() {
  const safety = text.safety;
  return (
    <div className="flat safety">
      <p className="not-advice" role="note">{safety.notAdvice}</p>

      <h2>{safety.beforeHeading}</h2>
      <p>{safety.beforeNote}</p>
      <ol className="questions">
        {QUESTIONS.map((question) => (
          <li key={question.ask}>
            <h3>{question.ask}</h3>
            <p>{question.why}</p>
            <p className="quiet"><b>{safety.whereTheAnswerIs}</b> {question.where}</p>
          </li>
        ))}
      </ol>

      <h2>{safety.levelsHeading}</h2>
      <p>{safety.levelsNote}</p>
      <div className="levels">
        {LEVELS.map((level) => (
          <div className={`level ${level.community}`} key={level.short}>
            <h3>{level.name} <span className="quiet">{level.short}</span></h3>
            <blockquote>{level.quote}</blockquote>
            <p>{level.inPractice}</p>
            <p className="quiet">{safety.community[level.community]}</p>
          </div>
        ))}
      </div>
      <p className="quiet">{safety.levelsSource}</p>

      <h2>{safety.whereHeading}</h2>
      <p>{safety.whereNote}</p>
      <ul className="packages">
        {AUTHORITIES.map((one) => (
          <li key={one.name}>
            <a href={one.href}>{one.name}</a> <span className="quiet">{one.issuer}, {one.year}{one.free ? `. ${safety.freeToRead}` : ""}</span>
            <span className="quiet">{one.what}</span>
          </li>
        ))}
      </ul>

      <h2>{safety.gapsHeading}</h2>
      <p>{safety.gapsNote(CHECKED)}</p>
      <ul className="gaps">
        {GAPS.map((gap) => (
          <li key={gap.what}><b>{gap.what}.</b> {gap.why}</li>
        ))}
      </ul>

      <p className="quiet after">{text.views.newHere} <Link href="/topics/safety/understand">{text.views.understand}</Link>.</p>
    </div>
  );
}
