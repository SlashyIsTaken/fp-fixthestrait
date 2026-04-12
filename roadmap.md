# Roadmap

The site has grown from a tight 12-solution dossier into something considerably larger. This is a good problem to have, but it has introduced real issues with navigation, focus, tonal consistency, and maintainability. This roadmap addresses those issues.

---

## 1. Landing Clarity — "What Is This?"

**Problem:** A new visitor scrolling through the hero section sees a big title, three stats, and a threat meter, but nothing that quickly telegraphs what the site *is*. The overline says "Global Energy Vulnerability Report — March 2026" and the subtitle explains the strait, but neither tells you that what follows is a satirical dossier with twelve absurd solutions, a fake group chat, a tanker simulator, and a dolphin named Steve. You have to scroll past the oil situation room and into the solution cards before the premise clicks.

**Plan:**
- Add a short, dry one-liner between the subtitle and the stats — something that immediately communicates the premise without breaking character. Along the lines of: *"This dossier contains twelve proposed solutions to the chokepoint problem. None of them work. All of them are interactive. One involves a dolphin."*
- Update the hero overline date (currently hardcoded to March 2026).
- Consider a subtle "scroll to begin briefing" indicator at the bottom of the hero viewport to guide first-time visitors downward.
- The oil section currently sits between the hero and the solutions grid. For new visitors, this front-loads a real market terminal before they've understood the joke. Evaluate moving the oil section below the solutions grid, or adding a brief "mission briefing" transition between hero and oil that frames the entire page as a classified dossier.

---

## 2. Navigation Overhaul — Grouping

**Problem:** The top nav currently has 12 items plus the Classified Mode toggle. On desktop this is a wall of monospace text; on mobile it's a long vertical list. Most visitors don't need all twelve links visible at once.

**Plan:** Group nav items into dropdown categories:

| Group | Items |
|-------|-------|
| **Briefing** | Solutions, Compare, What If? |
| **Interactive** | Strait Room, Simulator, Incident Sim |
| **Intel** | Oil, Ask Steve, Glossary |
| **Contribute** | Submit, GitHub (currently "Wikipedia" links to Wikipedia — keep as-is but move out of primary nav) |

This reduces the top-level nav to 4-5 groups plus the Classified Mode toggle. Each group expands on hover/click to show its items. The Wikipedia link can move into the footer or the Intel dropdown. On mobile, the hamburger menu shows the same groups as expandable sections.

Implementation notes:
- CSS-only dropdowns (no JS dependency for navigation).
- Preserve hash-based deep linking — dropdown items still link to `#section-id`.
- Keep the Classified Mode toggle in its current prominent position (right end of nav bar, not inside a dropdown).

---

## 3. Tonal Audit — Deadpan Consistency

**Problem:** The site's editorial voice is at its best when it delivers absurd content with the unwavering seriousness of a leaked intelligence memo. Some areas break this by being too self-aware, too playful, or too conventionally "internet funny."

**Areas to review:**

- **Solution card descriptions:** Most are strong. A few lean slightly toward "wacky internet copy" rather than the dry briefing voice. Pass over each and tighten to match the best examples (the Krazy Straw card and the Time Travel card are the gold standard — they're funny because they never wink).
- **Ask the Analyst (Steve):** Audit the response pool to ensure Steve's voice is consistent — he should be a weary, overqualified marine mammal, not a joke bot. Every Steve response should read like a resignation letter he hasn't submitted yet.
- **Incident Simulator:** The button labels are good ("Saudi Arabia sighs audibly" is perfect). Audit the feed responses for tone.
- **Submit form rejection messages:** Some are strong, some are a bit "lol random." Trim or rewrite the weaker ones.
- **News ticker items:** A few use phrasing that's more "comedy Twitter" than "intercepted intelligence wire." Rewrite to match the classified ticker items, which are consistently better.
- **Hero overline:** "Global Energy Vulnerability Report" is good. Keep.

General rule for the audit: if a line would get a laugh on Twitter but wouldn't belong in a fake leaked CIA memo, it needs rewriting.

---

## 4. Classified Mode — Consistency Pass

**Problem:** Classified mode was originally a tight system: toggle it on, the ticker switches to classified traffic, analyst notes appear in solution modals, and the submit form gets a clearance gate. But as new sections have been added (Incident Simulator, Ask the Analyst, Glossary), classified mode doesn't extend to them consistently.

**Plan:**
- **Incident Simulator:** Add classified-mode behavior. When active, the feed entries should include additional `[EYES ONLY]` detail lines, or certain buttons should unlock classified-only events (e.g., "Activate BENDY BOY," "Deploy Steve with tactical payload").
- **Ask the Analyst:** Steve's responses could shift register in classified mode — dropping the public-facing diplomatic phrasing and being blunter, referencing internal operations, mentioning things "above your clearance" that he's telling you anyway.
- **Glossary:** Add classified-only glossary entries that appear when the mode is active — internal jargon, codenames, entries that are visually marked `[CLASSIFIED]` and reference events from the analyst notes (e.g., *BENDY BOY*, *TEMPORAL ASSET*, *STEVE'S LAWYER*).
- **Comparison Matrix:** Add a classified-only column (e.g., "Internal Assessment" or "Actual Status") visible only in classified mode, with short deadpan verdicts.
- **What If? Timeline:** Add classified annotations — brief analyst margin notes on each timeline entry, visible only in classified mode.
- **Visual consistency:** Ensure all classified-mode elements use the same green `[EYES ONLY]` / `[CLASSIFIED]` tag styling. Currently the analyst notes in modals use `.analyst-note` and the oil section uses `.classified-hint` — these should share a visual language.

---

## 5. Glossary Expansion — Categorized

**Problem:** The glossary currently has 20 entries in a flat list. It's excellent — the definitions are sharp and tonally perfect. But expanding it much further in a flat list creates the same "wall of content, where do I start" problem the site already has.

**Plan:** Organize entries into 4-5 categories displayed as collapsible sections (first category open by default, others collapsed). Suggested categories:

| Category | Description | Example entries |
|----------|-------------|-----------------|
| **Oil & Markets** | Commodities, trading, pricing | WTI, Brent, Risk Premium, Safe Haven Asset, OPEC+, Strategic Reserve |
| **Intelligence & Operations** | Spycraft, analysis, signals | SIGINT, HUMINT, Analyst, Intelligence, Chatter, Dossier |
| **Geopolitics & Diplomacy** | International relations, conflict | Chokepoint, Ceasefire, Escalation, De-escalation, Geopolitics |
| **Strait-Specific** | Terms unique to this dossier | Steve, Strait Incident Probability, Tanker |
| **Classified** *(classified mode only)* | Internal operational terms | New entries referencing site lore |

New entries to write (targeting ~35-40 total across all categories):

- **Oil & Markets:** Contango, Backwardation, Barrel (the unit, not the projectile), Spot Price, Futures Contract, SPR (Strategic Petroleum Reserve), LNG
- **Intelligence & Operations:** OSINT, ELINT, Asset, Exfiltration, Dead Drop, Need-to-Know, Compartmentalization
- **Geopolitics & Diplomacy:** Sanctions, Freedom of Navigation, Transit Passage, Proxy, Deterrence, Saber-Rattling
- **Strait-Specific:** VLCC, Bunkering, Flag State, Hormuz Island
- **Classified (classified mode only):** BENDY BOY, Temporal Asset, Dolphin Local #1, Steve's Lawyer, The Omelette Station, Gulf of America 2

Each new entry should match the existing tone: real definition, delivered deadpan, with a twist that either reveals the absurdity of the real thing or ties it back to the dossier's lore.

Implementation: each category is a `<details>` / `<summary>` pair or a simple collapsible div with a click handler. Category headers use the existing overline/mono styling.

---

## 6. Structural Consideration — Astro Migration

**Problem:** The site is fully static with zero dependencies, which was the right call at 5 features. At 12+ features with a 52KB HTML file, 128KB `app.js`, and 63KB `styles.css`, the single-file architecture is becoming a maintenance burden. Adding a new solution means editing four different places in one enormous file. The project's editorial guidelines still say "no dependencies, no framework" — but the project has outgrown the constraints that guideline was written for.

**Case for Astro:**
- **Component model without client-side framework cost.** Astro ships zero JS by default and only hydrates interactive islands. The site's current architecture already works this way conceptually — most content is static HTML, with JS only for the interactive bits (simulator, charts, chat). Astro formalizes this.
- **File organization.** Each solution, each section, each glossary category becomes its own component file. The 128KB `app.js` monolith splits into maintainable pieces.
- **Content collections.** Glossary entries, ticker headlines, chat messages, and analyst notes could live in Markdown/JSON content files rather than being buried in JS string literals. This makes contributions dramatically easier — a contributor adding a glossary entry edits a Markdown file, not a 128KB JavaScript file.
- **Routing (optional).** The site could remain single-page, or individual solutions could become their own pages (improving SEO and shareability). Astro supports both.
- **Build output is still static.** The deployed artifact is the same: HTML, CSS, JS files served by nginx. The Docker setup barely changes.

**Case against:**
- Adds a build step and `node_modules`.
- Contributors now need Node.js installed.
- The "zero dependencies" badge in the README becomes a lie.
- Migration effort is non-trivial — every section needs to be extracted into components, every inline script needs to become an island.

**Recommendation:** The migration is worthwhile, but it should be done after the content/design improvements above (items 1-5) are complete. Migrating the architecture while also changing content creates too much churn. The suggested sequence:

1. Complete items 1-5 in the current vanilla stack.
2. Create an `astro` branch.
3. Scaffold the Astro project, migrate section by section.
4. Validate that the build output is functionally identical.
5. Merge and update the README.

The migration could also be phased: start with the static content sections (glossary, comparison matrix, what-if timeline) and leave the heavy interactive sections (simulator, oil charts, canal map) as client-side islands that largely keep their existing JS.

---

## Priority Order

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| 1 | Navigation grouping | Medium | High — immediately reduces overwhelm |
| 2 | Landing clarity | Small | High — first impression for every visitor |
| 3 | Tonal audit | Medium | Medium — quality of life for the whole site |
| 4 | Classified mode consistency | Medium | Medium — rewards engaged users |
| 5 | Glossary expansion + categories | Medium | Medium — expands best content without clutter |
| 6 | Astro migration | Large | High long-term — but not urgent |

---

## Contributing

All improvements should follow the existing editorial guidelines:

- **Maintain the deadpan voice.** Every line is delivered with the unwavering seriousness of a leaked intelligence memo.
- **Stay grounded in real facts.** The funniest lines are built on something true.
- **No dependencies** (until the Astro migration, at which point: one dependency, used correctly).
- **Test on mobile.** The nav changes in particular must work well on small screens.

If you're picking up any of these items, open an issue first so work doesn't overlap. PRs welcome. The bar is low. The strait is lower.
