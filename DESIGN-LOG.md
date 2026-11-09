# DESIGN-LOG: Learn Hypercore (full DADA redo)

9 Nov 2026. Mode **Adaptive** (a public learning site). Run type **Full** with the **Landing** rule on the first screen.
Panel seated by `pick_panel.py --mode adaptive --run-type full --data-graphic` (8 seats, one agent each, launched three at a time, each filing to a panel directory; every seat read its own `seats/<id>.md`). Tools used: Playwright (headless Chromium) for measurement; `npm` to install the real library and run every example; `scripts/check.mjs` as the gate; no graph or workflow-engine tooling was available, so the graph and Frontier are kept as text below.
**Stop conditions: S1 met, S2 met with one qualification, S3 NOT met, S4 met, S5 met.** The run is reported as complete at R2 with S3 open (two consecutive quiet WHOLE rounds were not run). See Stop test.

## Traversal Plan

Brief restated: redesign the inherited LearnHypercore docs site as a much better, trustworthy way to learn Hypercore.
Seed, assigned from `references/anchor-graph.md` and **reconstructed after R0 from the moves actually taken**, not chosen before them:
Stance `Design as Art (Bruno Munari)` · Rules `Visual Hierarchy (Arnheim, Dondis)` and `Gestalt Principles of Perception (Wertheimer, Koffka, Köhler)` · Breaker `Making and Breaking the Grid (Timothy Samara)` · Counterpoint by dotted edge `crit_prov_debord -.->|attacks smoothness favored by| crit_use_krug`.
Chain: Munari's design-as-art (the object is the page) -> Visual Hierarchy (one dominant figure) -> Gestalt (proximity and common fate tie a block to its hashes) -> Samara (break the card grid with a working tree), counterpointed by Debord vs Krug.

### Frontier (after R0)
| Candidate | Reached via | From anchor | Status |
|---|---|---|---|
| F-a Draw the log: a live Merkle tree as the landing graphic | Breaker | Samara | TAKEN (M2) |
| F-b Make every code example run and show its real output | Debord R0 F6, Cairo R0 F1 | Visual Hierarchy | TAKEN (M3) |
| F-c Delete unsourced claims, add the missing API page | Debord R0 F2-F5, Cairo R0 F2 | Debord seat | TAKEN (M4, M1) |
| F-d A gate that fails on the inherited site | Cairo R0 probe | Cairo seat | TAKEN (M5) |
| F-e Primary CTA below the fold at 375x812 | Krug R1 F4 / R2 F4 | Krug seat | DEFERRED (the figure, not the CTA, is the first-screen rule) |
| F-f Cut the chapter rail so the tree owns the page | Shklovsky R1 F3 | Samara counterpoint | DEFERRED (OVERRULE, see Resolutions) |
| F-g Rename "root" to "peak" | Tufte R2 F4 | Tufte seat | DEFERRED (OVERRULE, see Resolutions) |

## R0 premortem (inherited site, measured)

Dead links api.html (every page), basic.html, installation.html. Code run against hypercore 11.40.3: `started` snippet 1 and `ExampleHypercore.js` crash (random-access-memory storage is no longer supported), snippet 2 is a SyntaxError, the replication example never shows data moving. started.html says the npm tag "may still reference version 10" while `latest` is 11.40.3. Unsourced adoption claims, a mailing list that does not exist, "write-ahead log" and RocksDB claims, "unparalleled", "next-generation", an external Google Fonts import, "All rights reserved" with no owner, no graphic, and 370px of header before content.

## Decision Records

## Move M1: Multi-page rebuild with a real API page (KEEP-THE-RULE)
Depends on: none. Anchors: Stance Design as Art (Bruno Munari) | Rule Visual Hierarchy (Arnheim, Dondis). Intent: 8 pages under one compact nav, no dead link. Formal argument: a learner trusts a map only if every road exists. Alternatives rejected: one long page (hides the API), keep six pages and add a stub api.html (a label with nothing behind it). Consequence: the API list is data (`data/api.json`), so it can be checked. Fence: n/a. Frontier effect: opens F-d. Reception dial: Adaptive; advanced pole = the interactive tree, acceptable pole = ordinary docs pages.

## Move M2: The landing is a live Merkle tree (BREAK)
Depends on: M1. Anchors: Breaker Making and Breaking the Grid (Timothy Samara) | Rule Gestalt Principles of Perception (Wertheimer, Koffka, Köhler) | Counterpoint Debord vs Krug. Intent: 8 numbered blocks and the tree of fingerprints above them; select a block to ring the hashes that verify it, forge a block to watch fingerprints change up to the signed value. Formal argument: the idea (append-only, verifiable, sparse) is a structure, so draw the structure. Alternatives rejected: a diary metaphor in prose (the inherited page; unfalsifiable), a static diagram (nothing to do). Consequence: it is a simulation (SHA-256, not BLAKE2b), so the page says so above the figure. Fence: the tree math lives in `assets/merkle.js` and is asserted by the gate. Frontier effect: F-e, F-f. Reception dial: advanced = interactive proof; acceptable = chapter links and a plain readout.

## Move M3: Every example runs; its output is printed from a real run (KEEP-THE-RULE)
Depends on: M1. Anchors: Rule Visual Hierarchy (Arnheim, Dondis). Intent: 4 examples in `data/examples.json`, run by `scripts/check.mjs` against the pinned hypercore, `expect` written from the run. Alternatives rejected: copy examples from the README (untested), keep the inherited ones (3 crash or fail). Consequence: the in-memory example is gone because the library no longer supports it; Get started says why.

## Move M4: Delete claims the README or a run cannot back (KEEP-THE-RULE)
Depends on: none. Anchors: Counterpoint Debord seat. Intent: remove adoption stories, the mailing list, the write-ahead-log and RocksDB claims, superlatives and Conclusion sections; mark paraphrase as paraphrase; state "unofficial". Consequence: the site is shorter and every statement names its source.

## Move M5: A gate that fails on the inherited site (KEEP-THE-RULE)
Depends on: M1, M3. Intent: `scripts/check.mjs` fails on dead links, banned phrases, external requests, example errors or different output, API names missing from a real core, and wrong demo numbers. Measured: run on the inherited commit it exits 1 with dead api.html links and four banned phrases per page.

## Moves from R1 (resolutions, each re-judged in R2)
M6 Roving focus, state words and a hidden text list for the tree. M7 Ring and cross marks beside colour; no dimming; darker orange; dark-mode label ink. M8 Forge replaces Alter/Restore (the log refuses edits). M9 Demo labelled "This demo", simulation note moved above the figure, signed value drawn and shown old -> new. M10 Code-block style leak fixed; `pre` keyboard-scrollable. M11 Cap on demo blocks computed so every leaf stays >= 24px wide. M12 Glossary before first use, "What you need", a no-install route.

## Panel Reports

### Panel, WHOLE, round R0  (artifact examined: inherited site at http://localhost:8124, commit 0f92937)
| Critic | Anchor used | Observed in the work | Verdict PASS/OBJECT | Requested change |
|---|---|---|---|---|
| Critic: Evidence (Cairo) | The Truthful Art | started-2 SyntaxError; RAM examples crash on 11.40.3; 3 dead links | OBJECT | run every snippet in CI; show output |
| Critic: Usability (Krug) | Don't Make Me Think | home is two black bars; no runnable first step; api.html 404 | OBJECT | one working example, one primary button |
| Critic: Provocateur (Debord) | The Society of the Spectacle | only about a fifth of the text is backed by the README | OBJECT | delete unsourced claims |

### Panel, WHOLE, round R1  (artifact examined: http://localhost:8124 after M1-M5)
| Critic | Anchor used | Observed in the work | Verdict PASS/OBJECT | Requested change |
|---|---|---|---|---|
| Critic: Provocateur (Debord) | The Society of the Spectacle | R0 claims gone; events unchecked, paraphrase unmarked | PASS | mark paraphrase |
| Critic: Provocateur (Shklovsky) | Art as Technique | tree is the break; Alter/Restore edits a log | OBJECT | make the refusal felt |
| Critic: Inclusion (Holmes) | Mismatch | jargon before glossary; no Node prerequisites | OBJECT | gloss first, add "What you need" |
| Critic: Inclusion (Mace) | Principles of Universal Design | focus lost on select; colour-only states; no text alternative | OBJECT | roving focus, shapes, text list |
| Critic: Evidence (Cairo) | The Truthful Art | dark-mode label contrast 2.11; dimming fails 3:1 | OBJECT | fix contrast; assert demo numbers |
| Critic: Evidence (Tufte) | The Visual Display of Quantitative Information | leaf hashes undrawn; labels dropped at 375; signed value omitted | OBJECT | draw every hash |
| Critic: Usability (Krug) | Don't Make Me Think | code blocks near unreadable (style leak); nav clipped | OBJECT | fix style, wrap nav |
| Critic: Perception (Kahneman) | Thinking, Fast and Slow | "8 blocks, 1 root" anchors as fact; disclosure small | OBJECT | label as demo |

### Panel, WHOLE, round R2  (artifact examined: http://localhost:8124 after M6-M12)
| Critic | Anchor used | Observed in the work | Verdict PASS/OBJECT | Requested change |
|---|---|---|---|---|
| Critic: Provocateur (Debord) | The Society of the Spectacle | F1-F4 fixed, no new unsourced claim | PASS | none |
| Critic: Provocateur (Shklovsky) | Art as Technique | one-way Forge, signed value old -> new | PASS | fix duplicated label |
| Critic: Inclusion (Holmes) | Mismatch | glossary before use, prerequisites stated | PASS | none blocking |
| Critic: Inclusion (Mace) | Principles of Universal Design | 8 of 8 findings fixed | PASS | refocus after Forge, wrap code |
| Critic: Evidence (Cairo) | The Truthful Art | leaf width at 320 was 19px, "1 fingerprints" | OBJECT | widen leaves, pluralise |
| Critic: Evidence (Tufte) | The Visual Display of Quantitative Information | every hash drawn, counts match marks | PASS | disambiguate "root" |
| Critic: Usability (Krug) | Don't Make Me Think | 7 of 7 R0 findings closed | PASS | inner-page padding at 375 |
| Critic: Perception (Kahneman) | Thinking, Fast and Slow | disclosure seen in the first screen | PASS | none |
| Critic: Evidence (Cairo) | The Truthful Art | confirmation pass: leaf width and padding fixed, plural still wrong on the live page | OBJECT | one word at home.js:72 |

Cairo's confirmation OBJECT is recorded as filed. The one-word fix was applied afterwards and measured on the rendered page (13 blocks, block 12 forged: "1 fingerprint ... changed"); Cairo did not re-sit, so this is **applied and measured, not re-judged**.

## Resolutions

| Seat(s): finding | Outcome |
|---|---|
| Cairo + Krug + Debord: dead api.html, broken and crashing examples | ADAPT (M1, M3): API page built; 4 examples run and print real output |
| Debord: unsourced adoption, mailing list, write-ahead log, superlatives | ADAPT (M4): all deleted |
| Cairo: "nothing can be erased" is false (clear and truncate exist) | ADAPT: Basics states what append-only does and does not mean |
| Cairo: stale "npm tag may reference version 10" | ADAPT: version stamped from `data/verified.json`, discrepancy with the README printed |
| Krug: code blocks unreadable (inline-code style leaks into pre) | ADAPT (M10) |
| Krug: phone nav clipped, no cue | ADAPT: nav wraps |
| Krug: blocks not signalled as selectable | ADAPT: block 3 preselected |
| Krug: "20 methods" vs "35 parts" | ADAPT: breakdown by kind on the API page |
| Krug: primary CTA below the fold at 375 | DEFERRED: Append is the visible action; figure bottom 612 of 812 |
| Cairo: dark-mode label contrast 2.11 and 2.28 | ADAPT (M7) |
| Cairo: selected label 4.00 | ADAPT (M7): darker orange, 5.38 |
| Cairo + Tufte: dimming fails 3:1 | ADAPT (M7): no dimming |
| Cairo: demo numbers asserted nowhere | ADAPT: `merkle.js` asserted in the gate with a failing fixture |
| Cairo: leaves below 24px at the cap | ADAPT (M11): cap computed; 375 -> 26.5px, 320 -> 27.3px |
| Tufte: leaf hashes undrawn, labels dropped at 375, signed value omitted | ADAPT (M9) |
| Tufte: two meanings of "root" | OVERRULE: the README and the installed source both call the peaks "roots", so renaming them would disagree with the documentation the site teaches; the signed value is labelled separately. Cost: one word reads two ways at n > 1 |
| Mace: focus lost after select, no aria-pressed, colour-only states, no text alternative, pre not scrollable, forced-colors | ADAPT (M6, M7, M10) |
| Mace: focus drops after Forge, code overflow at 320 | ADAPT: focus moves to Reset; inline code wraps |
| Holmes: terms before glossary, no prerequisites, blank sentence without JS | ADAPT (M12) |
| Shklovsky: Alter/Restore edits a log | ADAPT (M8): one-way Forge, Reset to undo |
| Shklovsky: the chapter rail is a habitual SaaS row | OVERRULE: SKILL.md's Landing rule needs a link per topic on the first screen; the rail is rows 654 to 796 of 800 at 1280, so cutting it costs the summary rule, and the figure still sits first |
| Kahneman: "8 blocks, 1 root" anchors as fact, disclosure small | ADAPT (M9) |
| Kahneman: block text not shown on leaves | DEFERRED: leaves are 27px wide; the hidden list names every block |
| Debord: events and descriptions unchecked, paraphrase unmarked | ADAPT: stated on the API page and in the footer |
| Krug: inner pages have 0px side padding at 375 | ADAPT: `main.page` padding override removed |
| Krug + Shklovsky: readout repeats the block label | ADAPT (applied and measured, not re-judged) |
| Cairo: "1 fingerprints" | ADAPT (applied and measured, not re-judged) |

## Anchor Ledger
| Anchor | Role | Status KEEP / ADAPT / SCRAP | Evidence | Replacement or note |
|---|---|---|---|---|
| Design as Art (Bruno Munari) | Stance | KEEP | the page is the object it explains; survived Shklovsky's "textbook diagram" objection | none |
| Visual Hierarchy (Arnheim, Dondis) | Rule | KEEP | tree first, CTAs second, chapter rail third | rail kept against Shklovsky |
| Gestalt Principles of Perception (Wertheimer, Koffka, Köhler) | Rule | ADAPT | proximity and common fate tie a block to its hashes; R1 added rings and crosses because colour alone failed Mace | state words and shapes added |
| Making and Breaking the Grid (Timothy Samara) | Breaker | KEEP | the card grid is broken by a working instrument; survived Kahneman's anchoring objection | demo labelled |
| crit_prov_debord -.-> crit_use_krug | Counterpoint | KEEP | Debord cut claims, Krug demanded a first runnable step; both PASS in R2 | none |

## Deletion review and residual diff (Step 2f)
Pre-existing elements and what they earned: Google Fonts import (earned nothing: SCRAP), "diary" metaphor repeated on every page (kept once, on Basics, as a receipt roll), six identical bullet lists (SCRAP), Conclusion sections (SCRAP), adoption list (SCRAP), RAM storage examples (SCRAP: crash). Retained-value ledger: the five README features, the API method names, sessions/snapshots/truncate/encryption topics, all kept and now tied to a run or a README line. Residual diff: pages 7 -> 8 (api added), code blocks that run 4 of 9 -> 4 of 4, dead links 3 -> 0, external requests 1 -> 0, console errors 0 -> 0.

## Step 2g: figures re-measured at the final state
| Printed figure | Procedure | Final value | Result |
|---|---|---|---|
| "3 hashes verify block 3" (8 blocks) | `merkle.js` proofFor(8, 3), asserted in check.mjs | 3 | reproducible |
| "2" for block 12 of 13 | same | 2 | reproducible |
| "4 fingerprints changed" forging block 3 | `changed()` | 4 | reproducible |
| "about 20" for a million blocks | ceil(log2(1,000,000)) | 20 | reproducible |
| "20 methods" (home card, API page) | count of kind=method in data/api.json | 20 | reproducible |
| "4 run and checked" | examples in data/examples.json, each run | 4 | reproducible |
| "hypercore 11.40.3" | data/verified.json against `npm ls hypercore` | 11.40.3 | reproducible |
| Fold at 1280x800: figure 442, controls 492, readout 546, CTA 640, rail 796 | getBoundingClientRect | as stated | reproducible |
| Fold at 375x812: figure bottom 612, controls 714 | getBoundingClientRect | as stated; readout (836) and CTA (988) fall below | recorded, see Frontier F-e |

## Stop test
- **S1** Frontier: no OPEN items; F-e, F-f, F-g are DEFERRED with reasons. Met.
- **S2** R2 returned PASS from 7 of 8 seats with no Andon. Cairo's R2 confirmation was OBJECT on one word; the fix was applied and measured but Cairo did not re-sit. Met with that qualification.
- **S3** Two consecutive quiet WHOLE rounds: NOT met. R2 produced ADAPT items, and no R3 was run.
- **S4** Ambition push: the Breaker (M2) was pushed from a static tree to a tree with a forge act, the signed value drawn old -> new, and a computed cap. Measured delta: leaves per figure labelled 0 -> 15 hashes at n=8; signed-value change shown 0 -> 1; contrast of forged and ringed labels 2.11 -> 5.14 (light proof label) and 7.88+ (dark). Met.
- **S5** Dotted edges: Debord vs Krug applied (both sat, both PASS). Met.

## Double loop
The panel found defects the author could not: a style leak that made every code block unreadable, a dropped keyboard focus, a "Restore" button that contradicted append-only, and two scripted edits that silently did not apply (found only by Cairo's confirmation pass reading the live page). The process failed in one place: a scripted `replace` that does not match changes nothing and says nothing, so fixes were reported before they were verified. Graph amendment: none to the graph; one to the workflow: after any scripted edit, assert the new string on the rendered page before reporting it.

## Carry-Forward Ledger
- Run the library: seven examples crashed or lied before a single seat looked at them. Install the real package and execute every snippet; print the output from the run.
- Compare the README with the registry: the README said "latest is 10" and npm said 11.40.3. Print the discrepancy, do not pick one.
- A claim lint (banned phrases) plus a dead-link crawl plus a failing fixture is cheap and caught the inherited site on the first run.
- A demo that simulates a real system says so above the figure, in words the fast reader sees, and names what differs (SHA-256 vs BLAKE2b).
- Padding set on an element that also carries the `wrap` class removes the page gutter: found on two sites in this session.

## Compliance Check
- [x] Tooling inventory done: Playwright, npm, node; no graph tooling available
- [x] Mode stated with the reason (Adaptive: public audience)
- [x] Panel seated from `pick_panel.py`, every seat briefed from its `seats/` file
- [ ] Seed with exact labels chosen before the first move: reconstructed afterwards (stated in the plan)
- [x] Run type stated (Full + Landing), no freeze broken
- [x] Landing leads with one bold graphic, complete in the first viewport at 1280x800 (bottom 442) and 375x812 (bottom 612)
- [x] BREAK move taken (M2)
- [x] Decision Record per move (M1-M5 in full; M6-M12 as grouped resolutions)
- [x] Panel Report per round, every critic citing something observed
- [x] Every OBJECT resolved ADAPT, OVERRULE or DEFERRED
- [ ] WHOLE rounds with S3 met: R0, R1, R2 run; S3 not met
- [x] Every printed figure re-measured at the final state (Step 2g)
- [x] Anchor Ledger complete
- [x] Double-loop paragraph written
- [ ] Run recorded in the ledger: done afterwards from this file, ungraded
- [x] Final reply states mode, tools, stop conditions and what was skipped
