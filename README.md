# Fix the Strait of Hormuz

A satirical interactive website exploring 12 absurdly impractical solutions to the Strait of Hormuz chokepoint crisis.

**Live site:** [fixthestrait.com](https://fixthestrait.com)

---

- [What Is This?](#what-is-this)
- [The 12 Solutions](#the-12-solutions)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Run Locally](#run-locally)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## What Is This?

The Strait of Hormuz is the world's most critical oil transit chokepoint — 33km of water between Iran and Oman, with ~21 million barrels of oil flowing through it daily. This website presents increasingly unhinged "solutions" to this geopolitical vulnerability, each one treated with the gravity of an actual classified briefing.

It is also a reminder that in times of genuine geopolitical chaos, sometimes the correct response is to build a website about training dolphins to carry oil barrels.

## The 12 Solutions

| # | Solution | Cost | Feasibility |
|---|----------|------|-------------|
| 1 | **Just Ask Nicely** — Polite diplomatic emails (third follow-up, first two ignored) | Free | Delusional |
| 2 | **Train the Dolphins** — 21 million dolphins with barrel harnesses | $2.1T/yr | Unethical & Impossible |
| 3 | **Giant Trebuchet** — Launch barrels at Mach 1.7 across the strait | $47B | Medieval |
| 4 | **Aircraft Carrier Bridge** — Park ~100 carriers side-by-side | $1.16T | Aggressive |
| 5 | **Operation Krazy Straw** — Covert underwater straw pipeline | $80B+ | Embarrassing |
| 6 | **Physically Move Iran** — Tectonic engineering to relocate the country | Incalculable | 200M years ETA |
| 7 | **Drain the Strait** — Pump out 31.4 trillion gallons of water | Absurd | 1,194 years |
| 8 | **Dig a Canal** — Draw your own canal through the Arabian Peninsula | Varies | Interactive |
| 9 | **CrudeCoin™** — Tokenize barrels as NFTs; oil never moves | $0 (technically) | Creative securities fraud |
| 10 | **Accelerate Climate Change** — Melt ice caps, raise sea levels 70m | Existential | Already in progress |
| 11 | **Just Rename It** — Rebrand the strait via executive order; Gulf of America precedent | $4B (marketing) | Executive Order |
| 12 | **Time Travel** — Prevent tectonic plates from converging 200M years ago | 1.21 Gigawatts | Temporal Paradox |

## Features

- **Interactive solution modals** with classified analyst notes, real-world facts, and interactive elements per solution
- **Email composer** (Solution 01) — draft your own diplomatic email to Iran, or read the one the intern already sent
- **Carrier incident log** (Solution 04) — watch the logistics of a carrier bridge collapse in real time
- **Strait Simulator** — a canvas-based game where you pilot a tanker through obstacles including angry tweets, rogue dolphins, and floating NFTs
- **The Strait Room** — a fake group chat between the USA, Iran, UAE, Oman, Saudi Arabia, Qatar, Bahrain, Kuwait, and Steve (dolphin)
- **Crude Oil Situation Room** — live WTI crude price, intraday chart, volume analysis, and the **Strait Incident Probability™** gauge (always alarming, always wrong)
- **Comparison matrix** — all 12 solutions rated across cost, feasibility, dolphin involvement, and geopolitical consequences
- **What If? timeline** — what actually happens to the global economy if the strait closes, day by day
- **Classified Mode** — toggle to reveal hidden analyst notes, internal memos, intercepted communications, and a market intelligence assessment about Steve
- **Solution submission form** — submit your own solution (it will be rejected, in increasingly creative ways)
- **Satirical news ticker** with rotating headlines
- **Hash-based deep linking** — share a direct link to any solution (`fixthestrait.com/#dolphins`)
- **Custom 404 page** — the missing page is last seen transiting the Strait of Hormuz

## Tech Stack

- **Vanilla HTML/CSS/JS** — no frameworks, no build step
- **Leaflet.js** for interactive maps (canal drawing, Iran relocation)
- **Canvas API** for the Strait Simulator game and oil price chart
- **Cloudflare Worker** for the live oil price API — proxies Yahoo Finance with a 15-minute cache, served at `oil.fixthestrait.com`
- **Docker + nginx** for deployment

## Run Locally

```bash
# With Docker
docker compose up

# Or just open the file
open website/index.html
```

The site runs on port `8080` via Docker.

The oil tracker requires the Cloudflare Worker to be deployed separately. Without it, the Situation Room falls back to a satirical error message about the CIA intercepting the data feed, which is honestly fine.

## Contributing

Pull requests are welcome. Issues are welcome. Opinions on the feasibility of the trebuchet solution are especially welcome.

The world is a lot right now. There are actual geopolitical crises, actual market disruptions, and actual people making actual decisions about the Strait of Hormuz that affect the actual global economy. This project does not solve any of that. What it does is point at the absurdity of the situation and laugh — because sometimes that's the only sensible response.

If you have a stupid idea for a 13th solution, open a PR. If you want to improve the simulator, the chat system, the oil tracker, or the classified mode, go for it. If you want to add a real diplomatic framework for resolving the Iran-US relationship in a way that ensures long-term energy security — that's slightly out of scope, but we'd read the PR.

**Some things that would make good contributions:**
- A 13th (or 14th, or 15th) solution — the stupider the better, the more grounded in real facts the funnier
- More Strait Room chat batches — Steve in particular has more to say
- Additional ticker headlines
- Mobile UX improvements
- Translations — geopolitical anxiety is a universal language

The only rule: keep it funny, keep it grounded, and don't actually recommend anything to anyone. The dolphins are not a serious proposal.

## Disclaimer

This is a satire/comedy project. No geopolitical advice is being offered. Please do not actually attempt to move Iran, drain the strait, or train dolphins for oil transport. The oil price data is real. The probability gauge is not. Steve (dolphin) is a fictional character. Any resemblance to actual dolphins engaged in commodity futures trading is coincidental and would be extremely concerning.

## License

[MIT](LICENSE)
