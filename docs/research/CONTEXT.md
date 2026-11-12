# Research context, concept and independent review

Assembled 2026-11-12. Source discussion and findings: 2026-11-05. This preserves the available research-IDE context, not a verbatim transcript of omitted earlier conversations. Follow the pinned originals in RESOURCES.md for full source documents.

## 1. Origin and product direction
Cyber December began as a durable cybersecurity learning and experimentation programme. December 2026 is a campaign, not the intended permanent limit of the product. Its workbench uses React/TypeScript, TanStack Start/Router and Vite. The requested first IDE slice was an incremental adaptation of the existing app, not a rewrite.

The central question: Where am I in my understanding, what connects to this, and what useful proof comes next? A calm research/learning environment, not a SOC dashboard, generic admin template, course catalogue or chatbot-first product. AI is optional. Completing a session or writing an entry is not proof of competence.

Primary journey: resume -> source -> note -> question -> branch -> observation -> reconnect -> return -> explain the change. Keep evidence and former interpretations available when understanding changes.

Buddy receives these ideas as research inputs. It does not automatically inherit the cybersecurity-only domain, campaign dates, source application's dependencies or service integrations. Extracting a durable product deserves an explicit boundary rather than silently expanding the old programme repository.

## 2. Spatial concept
- Activity rail: Now, Investigations, Library, Journey.
- Browser sidebar: scoped investigation tree, sources, search/list and history.
- Centre: one or at most two working groups with independent active selection. Reading, note editing, map, overview, comparison and experiment are peer surfaces.
- Context dock: provenance, backlinks, related sources and questions for focused selection; a substantial editor belongs in the centre.
- Bottom utility dock: artifacts, recorded outputs or supporting activity; not an executable terminal or permanent AI chat by default.
- Command bar: open/search, layout controls, focus/restore/reset and honest save state.

Study places source beside note; Explore keeps map beside evidence; Reflect compares current and former interpretation. These are reversible arrangements, not mutually exclusive pages. Avoid nested navigation and repeating toolbars. Graphite chrome with a light work surface was a proposed visual direction; actual visual acceptance requires rendered screens.

## 3. Interaction and persistence constraints
Preview selection may replace only a clean preview. Keep open makes a tab persistent; Open beside uses group two. Closing never deletes a record. Dirty work cannot be silently replaced or dismissed. Duplicate views share a draft, not divergent editable copies. Context follows focused group unless explicitly pinned. Preserve reading position and parent branch context.

Focus temporarily hides auxiliary regions and restores the prior arrangement. Reset layout never resets journal, drafts or theme. Keep meaningful object/view navigation in validated URLs; panel resizing and transient focus must not flood browser history. Preserve original routes during adaptation.

Separate canonical knowledge, drafts, layout and transient interaction. Layout contains no document bodies, provider secrets or canonical learning records. SSR uses deterministic defaults, restores validated/versioned preferences after hydration, gates writes until restore resolves and debounces resizing. Malformed/denied storage needs explicit handling. Mobile adaptation must not erase desktop preferences.

On narrow screens show one useful surface and explicit group switching/sheets, not five miniaturized columns. Keyboard tabs, accessible names, focus return, non-pointer resize controls, reduced motion and graph list alternatives are requirements, not inferred successes. Avoid recursive docking, floating windows, Monaco or a plugin framework just to obtain tabs.

## 4. Knowledge, provenance and ownership
Represent sources, notes, questions, claims, assumptions, observations, interpretations and typed links without conflating their epistemic status. Support questions without tasks, many-to-many topics, branching, park/return, reframe, supersession and contradictions. A source can serve several investigations without competing copies.

Source-declared, user-declared and machine-suggested links remain distinct. Suggestions require explicit acceptance; rejection/reconsideration needs history. Acceptance is not proof. Node degree is not importance or truth. Personal confirmation of assisted work is not independent review. Do not store hidden model reasoning as provenance.

Original service boundaries: Cyber December owns programme records; BuildRadar owns event cases; Observstory projects state rather than orchestrating; Knowledge Lab may host revision-aware memory/retrieval rather than canonical truth; LightRAG is a rebuildable discovery index. These are prior architecture intentions, not verified live contracts for Buddy.

Future retrieval should expose source revision, excerpt, freshness and corpus coverage. Outage must leave reading, capture and manual links usable. Private audience, redaction/deletion and derived-index cleanup must be designed before real integration. History retention never authorizes keeping secrets indefinitely.

## 5. Historical implementation status
PR blackmath88/cyber-december27#8 merged. The independently inspected code baseline was 9489aafdfa84f8b08fbfd131d7854502c68b3c19. The independent review and plan were later committed at a58f798a60dbac73ca061740f70f65591867ad31.

At that time: /ide shell, tabs, two groups, layout restoration and themes existed; B4 substantially implemented; B5 meaningful partial; B6 local continuity only; B7 local lexical retrieval and history only; B8 evaluation protocol, not actual study results. No cloud sync, login, live Knowledge Lab query or LightRAG integration was established. Assumption type and richer reframe/history remained incomplete.

A GitHub build succeeded and Cloudflare Workers Builds failed. Deployment success was not established. The author reported 53 unit tests and 103 browser checks; the independent reviewer did not rerun these. The browser script was not in CI and included classic-view checks. These are historical observations, not current service status.

## 6. Independent verdict
Overall: partly holds. Keep the architecture and useful prototype; do not rely on the browser journal as the only copy of month-long work before integrity/history hardening. The review inspected source and check metadata, but did not execute the app/tests, visually inspect screenshots or audit screen readers.

| Claim | Verdict and boundary |
| --- | --- |
| C1 optional v1 keys | Holds narrowly: original shape supported, not every writer/round trip. |
| C2 legacy HTML preserves fields | Partly: author's check, not full independent mixed-writer verification. |
| C3 contradiction never dropped | Does not hold absolutely: same-record attachment replacement loses prior stance/note. |
| C4 stale tab cannot overwrite | Does not hold absolutely: revision read/check/write is non-atomic. |
| C5 non-overwriting merge | Partly: pure function retains local conflicts, UI uses stale captured state and replace:true. |
| C6 local BM25 retrieval | Holds inspected scope: lexical, no embeddings or live LightRAG. |
| C7 tentative suggestions | Holds normal path; reconsideration does not retain full decision history. |
| C8 safe Markdown | Holds renderer scope: React elements and http(s) links, not whole-app security audit. |
| C9 bounded map/list | Holds source-level: deterministic layout, resize handling, keyboard/list and 16 displayed connections; usability untested independently. |
| C10 SSR-safe layout/reset | Holds source-level: deterministic default, effect restore, gated/debounced separate storage. |
| C11 contrast >=7:1 | Partly verified: selected heading/context pairs in author's script, not all states or rerun. |
| C12 no tracking | Partly verified: no application analytics found in inspected modules; hosting/dependencies/network not audited. |
| C13 test totals | Partly verified: CI path inspected, totals not independently executed, browser suite absent CI. |

## 7. Specific findings and counterexamples
F1: addEvidence finds an attachment by evidence record ID and assigns c.evidence[i] = item. Attach the same source as contradicting/note A then supporting/note B; former stance/note is not retained. Existing test uses different evidence records and misses that case.

F2: Two tabs can both read revision 5 then write different documents as revision 6. Last write can lose the other's update. Testing an already-advanced revision does not establish atomicity. This was a source-level interleaving, not an independently reproduced browser failure.

F3: WorkbenchShell merges imported data with captured db after asynchronous file reading, then commits with replace:true. Intervening work can be replaced. The pure merge's non-overwriting property does not prove integrated UI safety.

F4: load() falls back to seed on parse/validation/storage failure without an established quarantine gate. Distinguish missing, inaccessible and invalid data, preserve raw recovery bytes and prevent destructive automatic replacement.

F5: understandingHistory reconstructs selected changes from current mutable records, not an append-only history. Link reconsideration loses former decision/timestamp; evidence edits are omitted. Some forms close/navigate without honoring commit's false result.

F6: provenance is coarse: entries labelled observed include predictions/interpretations; ID-inferred seed origin can mislabel edits. Branch UI displays a heading but persists only document ID, not exact section/revision. Evidence references mutable records.

F7: local search omits imported snapshot Source records and historical claim revisions. Now's Next sessions sorts/takes three without filtering past sessions. Session validation is December-2026-only and task topics are single-valued. These are bounded product gaps, not all equal in severity.

## 8. What follows from the review
Optional arrays inside v1 are reasonable bounded compatibility, not a long-term writer protocol. A version bump alone does not fix concurrency. Resolve legacy and modern whole-document writers, producer/capability policy and compatibility tests.

Local lexical retrieval is an honest baseline; evaluate representative search quality before adopting semantic retrieval. B7 remote work remains incomplete. Preserve provenance/history before enriching the map.

Priority order: (1) data safety and failed-save recovery; (2) evidence/decision history and section/revision origins; (3) repeatable browser/failure/accessibility verification and real sessions. Deployment is a separate workstream. Use exports during experimental study.

## 9. Further concept: an owned learning record
Keep four layers: canonical current state; pending commands/drafts bound to an expected base; explicit evidence/decision changes; rebuildable workspace/search/graph/timeline projections. Add the smallest auditable history needed rather than rewriting everything as an event platform.

Give an evidence attachment stable identity independent from its source. The same document may support one passage and contradict another. Retain stance, annotation, reason/time and available source revision/section/excerpt identity. Missing sources remain visible as unresolved references. Historical migration must label unknown history, never invent it.

No remote usage analytics is needed for hardening. Any later instrumentation needs an explicit privacy/retention scope and must not silently change no-analytics claims.

## 10. Scope of this transfer
This package preserves the research-workspace thread and its resources. An older unrelated pixel-art 'A dope E' mascot discussion (Motte/EGuide references) is acknowledged but not reconstructed: detailed material/URLs are unavailable in the retained conversation and no connection to Buddy was established. No missing research or source identity is invented.
