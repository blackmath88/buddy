# Next build plan and Claude handoff

Proposed, not executed by this documentation import. Derived from the November 5 hardening plan. Inspect current source before assuming a finding still applies.

## BUDDY-0 — Decide the receiving product boundary
Buddy currently receives research documentation, not the Cyber December implementation. Choose explicitly: research home, reusable workspace extraction, or a separate application. Inventory actual code/instructions. No scaffolding, dependency installation, data migration or source-application repairs are implied by this import.

If extracting: select minimal modules and inspect licensing, assets, dependencies and domain coupling. Keep programme-specific dates, cybersecurity records and service authority out of a generic workspace unless deliberately chosen. Record the extraction/source-of-truth decision. A repaired source app is not automatically repaired Buddy code.

## H0 — Establish baseline and reproduce
For repairs to Cyber December, work there on a dedicated branch. For adopted code in Buddy, record exactly which revision/modules were adopted. Preserve uncommitted work and actual journals. Read relevant instructions and the pinned context first.

Reproduce with synthetic data and disposable browser contexts:
- Same evidence attached again with opposite stance/note.
- Two real tabs attempting writes from the same base.
- Intervening save during asynchronous import/read/confirmation.
- Invalid stored bytes followed by load and attempted save.
- Save refusal while question/claim/inspector forms are open.

Classify reproduced / source-supported / not reproduced / changed upstream. Add focused failing regression tests where feasible. Correct current overbroad labels without rewriting dated historical reports. Do not weaken assertions to get green tests.

## H1 — Safe write protocol, recovery and caller contract
Bind writes to an explicit expected base. Suggested outcomes: saved, volatile, conflict, invalid, unavailable. Do not conflate an in-memory change with durable save. Preserve the attempted edit and latest state on rejection. Failed forms must not clear, close or navigate to an unsaved record.

Compare one enforceable local strategy: transactional IndexedDB with expected-base check/write in the same read/write transaction, or Web Locks used by every supported writer with an explicit unavailable-lock policy. localStorage read/check/set and post-write checks are not atomic; BroadcastChannel/storage events only notify. No unsafe silent fallback.

Resolve legacy HTML: shared protocol, read-only/import use, or isolated namespace plus explicit merge. Do not claim safety from nonparticipating writers. Do not retain two independent writable authorities.

Separate absent, invalid and denied storage; preserve invalid bytes and recovery/export access before replacement. Handle quota/permission failures without fake success. Explicit Restore needs exact overwrite confirmation plus recovery opportunity. Design migration, verification, rollback and old-export tests before changing authority. Stop for approval at that gate.

Acceptance: overlapping writes preserve acknowledged changes or surface an explicit recoverable conflict; invalid data is not replaced by seed; failed saves preserve work; layout reset cannot reset journal.

## H2 — Transactional merge and inspectable conflicts
Parse/validate, preview against an explicit base token, then commit through H1. If state changes, recompute/review or reject. Ordinary import cannot use an unconditional replace:true bypass. Reserve overwrite for explicit Restore.

Retain local-by-ID default while exposing collection/ID/title/differing fields and access to incoming conflicting content. Structural comparison must not treat key order as a meaningful conflict. Define attachment/event identity before merging histories. Show unresolved references and exclusions.

Acceptance: work saved during file reading/confirmation survives; cancel is a no-op; invalid import preserves state; rejected incoming versions remain inspectable/exportable.

## H3 — Evidence, decisions and provenance
Version evidence attachment changes and suggestion accept/decline/reconsider decisions with explicit IDs/times. Retain prior stance/note and the reason for change. Keep old claims on supersession and distinguish retained old evidence from evidence deliberately attached to the replacement claim.

Persist source document/record revision and section anchor when available. Do not invent absent metadata. Distinguish prediction, observation and interpretation. Do not infer edited-record authorship solely from ID patterns. Missing sources remain visible.

Migration labels old state as a baseline with unknown earlier history. Define sensitive-data redaction/deletion policy rather than treating append-only as eternal retention.

Acceptance: contradicts -> supports -> revised note and decline -> accept are reconstructable; branches reopen available origins; timeline and graph reflect the stored changes.

## H4 — Honest resumption and search
Use an injected clock and explicit campaign-local time policy to separate past/upcoming/unscheduled sessions. Keep campaign limits explicit until separately generalized. Recorded progress is not mastery.

Build a representative relevance fixture set before tuning lexical retrieval or adding semantic search. Evaluate imported source excerpts/history with clear current/historical labels; expose corpus coverage/staleness. No remote integration in this stage.

## H5 — Reproducible verification and accessibility
Pin browser tooling; install Chromium in CI; run focused IDE plus multi-context failure tests, not just classic happy paths. Include migration, invalid storage, merge races, failed-save forms and legacy-writer policy. Do not depend on global Playwright.

Test raw HTML handling/unsafe link schemes and reference validation. Check split-map SVG identity, keyboard/list equivalence, focus return/dialog containment, resize, zoom, small viewport, reduced motion and relevant contrast states. Report manual screen-reader testing as run/not run; ARIA alone is not acceptance.

Build, private-access verification and successful deployment are distinct outcomes. Fix hosting separately with authorization; do not switch automatic publishing on to claim success.

## H6 — Real study evaluation
Use actual dated sessions and existing evaluation protocol. A short rehearsal is useful, not proof of a month of benefit. Keep exports. Observe resumption, source finding, correction, multi-pane usefulness and lost-context incidents. Remove friction before adding docking/AI features. Publish no fabricated evaluation results.

## Release gate and PR boundaries
1. Reproductions and agreed storage design.
2. Write/recovery protocol and all caller handling.
3. Transactional merge/conflicts.
4. Evidence/decision history and honest migration.
5. Resumption, browser CI and accessibility.
6. Real-study report.

Each PR supplies starting commit, changed files, compatibility implications, exact commands/results, baseline failures, real screenshots when obtained, remaining risks and approval needs. No unrelated cleanup or wholesale rewrite.

## Claude starting prompt
Read README.md and docs/research/{CONTEXT,BUILD-PLAN,RESOURCES}.md in blackmath88/buddy. Preserve this repository's existing work. First inventory what code actually exists and state whether this is documentation-only or an approved extraction. Do not pretend the Cyber December app already lives here.

Treat the independent review as findings to investigate, not infallible instructions. Use pinned original documents to recover detail. If application repair is authorized, start with H0 in the repository that owns the implementation, on a dedicated branch; use synthetic journals and disposable contexts. Add regression tests, implement only bounded approved fixes and report evidence.

Do not merge, deploy, add cloud/auth/RAG, execute security experiments, or change storage authority/migrate persisted data without explicit approval. Preserve original reports as dated evidence. Stop at the storage design/migration gate with concrete options, not a proposal for a new backend.

Handoff: branch/PR, reproduction table, actual fixes, executed checks and baseline failures, unresolved risks, storage decision/migration implications and exact approval needed next. Never claim hardening complete merely from source reasoning or green happy-path tests.

Status: all work here is proposed; no H0-H6 implementation or evaluation was executed by this import.
