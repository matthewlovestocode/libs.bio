/**
 * Running the desktop app from source, which is the only way to run it at present.
 *
 * Every step here was carried out before it was written down, on a clone made fresh from GitHub, on
 * 2026-11-20. That is not ceremony: the first attempt failed. The repository asked for
 * `@biolibs/bionet-tools` `^0.1.22` while its own window imported ten bench hooks that arrived
 * after that version, so a clean clone stopped with an error naming an export the reader has never
 * heard of. Working on the app hid it, because there the packages are linked from the checkout next
 * door, where they are always current. The floors and the lockfile were corrected, a second clone
 * was made, and these are the commands that worked on it.
 *
 * So the page says what it says because it was done, and the version numbers under *What was used*
 * are the machine it was done on rather than a guess at a minimum.
 */

/** One command to run, and what it does. */
export interface Step {
  command: string;
  what: string;
  /** What to expect while it runs, when that is not obvious or not quick. */
  note?: string;
}

export const STEPS: Step[] = [
  {
    command: "git clone https://github.com/matthewlovestocode/bionet-desktop.git",
    what: "Takes the source. It is MIT, and about 180 packages' worth of dependencies.",
  },
  {
    command: "cd bionet-desktop && npm install",
    what: "Fetches those dependencies. A few seconds.",
    note: "npm may say that two packages have install scripts it did not run. Nothing here needs them; the app builds and runs either way.",
  },
  {
    command: "npm run dev",
    what: "Builds the window and opens it.",
    note: "The first run downloads Electron, which is about 264 MB and the slow part. After that it starts in a couple of seconds. The whole folder comes to roughly 540 MB.",
  },
];

/** What it does the first time, so nobody is surprised by what it asks. */
export const FIRST_RUN: { text: string; command?: string }[] = [
  { text: "It asks who is at this device. The name is what your lab sees beside each change you make; the key that signs them is made on the spot and sealed by the operating system's keychain, and it does not leave the computer." },
  { text: "Then it offers to found a lab, or to join one. Founding needs no network, no server and no account: you have a working freezer on one machine, and everything you do is a signed entry in that device's own log." },
  { text: "To try two members against each other on one computer, start a second device with a profile of its own.", command: "npm start -- --profile=bob" },
];

/** The things somebody should know before they spend the time, said before the commands. */
export const BEFORE = [
  {
    term: "It is not packaged",
    text: "There is no installer, no signed application and no updates. You are running it out of a checkout, and to move it forward you pull and build again. When there is something to download it will be said here.",
  },
  {
    term: "Only macOS has been tried",
    text: "Electron runs on Windows and Linux and nothing in the app is knowingly macOS-only, but these steps have not been carried out on either, so this page does not claim them.",
  },
  {
    term: "It needs a keychain",
    text: "The device's key is sealed by the operating system. Where there is nowhere safe to put it the app says so and stops, rather than making a key it cannot protect — which can happen on a bare Linux session with no keyring running.",
  },
];

/** The machine these steps were carried out on, rather than a guess at the minimum. */
export const WHAT_WAS_USED: { what: string; version: string }[] = [
  { what: "macOS", version: "27.2.1" },
  { what: "Node", version: "26.13.0" },
  { what: "npm", version: "11.17.0" },
  { what: "Electron, fetched by the app", version: "45.3.2" },
];

export const PASSAGES = [
  {
    id: "why-from-source",
    heading: "Why there is nothing to download",
    paragraphs: [
      "The app is written and it works — the pictures on the bench page are of it — but packaging an application is its own job: an installer for each system, a signing certificate, somewhere to host it and a way to deliver updates. None of that is done, and shipping a half-done version of it would be worse than saying so.",
      "What exists is the source, and the source runs. If you have used a terminal before, three commands and a download get you a working lab on your own machine.",
    ],
  },
];
