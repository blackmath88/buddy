# Source documents, references and reuse boundaries

Collected 2026-11-12 from the retained discussion and pinned v0.2 blueprint. Links are research resources, not endorsements, licence clearance, installed dependencies or newly benchmarked services. External moving branches can change. Inspect exact revisions and code/asset licences before reuse. This package copies no third-party implementation.

## Primary source and chronology
- Source repository: https://github.com/blackmath88/cyber-december27
- Original merged implementation PR: https://github.com/blackmath88/cyber-december27/pull/8
- Independently reviewed code baseline: https://github.com/blackmath88/cyber-december27/tree/9489aafdfa84f8b08fbfd131d7854502c68b3c19
- Review/roadmap documentation commit: https://github.com/blackmath88/cyber-december27/commit/a58f798a60dbac73ca061740f70f65591867ad31
- Full v0.2 concept, including B0-B8 and historical status: https://github.com/blackmath88/cyber-december27/blob/a58f798a60dbac73ca061740f70f65591867ad31/docs/UI-UX-EVOLVING-LEARNING-WORKSPACE.md
- Earlier v0.1, superseded where v0.2 differs: https://github.com/blackmath88/cyber-december27/blob/3b649733e46325ac7701089433f1949cf66356a6/docs/UI-UX-EVOLVING-LEARNING-WORKSPACE.md
- Builder's full report and section-8 questions: https://github.com/blackmath88/cyber-december27/blob/a58f798a60dbac73ca061740f70f65591867ad31/docs/reports/2026-11-05-research-ide-review.md
- Full independent review: https://github.com/blackmath88/cyber-december27/blob/a58f798a60dbac73ca061740f70f65591867ad31/docs/reports/2026-11-05-research-ide-independent-review.md
- Full original hardening plan: https://github.com/blackmath88/cyber-december27/blob/a58f798a60dbac73ca061740f70f65591867ad31/docs/RESEARCH-IDE-HARDENING-PLAN.md
- Evaluation protocol (not results): https://github.com/blackmath88/cyber-december27/blob/a58f798a60dbac73ca061740f70f65591867ad31/docs/RESEARCH-IDE-EVALUATION.md

The source repository's AGENTS.md, README.md, docs/MISSION-CONTROL.md, docs/DECEMBER-2026.md and apps/workbench/README.md remain required orientation for work there, not automatically governing instructions for Buddy.

## Code evidence locator
At the reviewed code baseline above, inspect:
- apps/workbench/src/domain/journal.ts — validation and optional v1 arrays.
- apps/workbench/src/domain/mutations.ts — evidence attachment/revisions.
- apps/workbench/src/domain/continuity.ts — merge/conflicts.
- apps/workbench/src/state/store.ts — persistence/revision guard/failure paths.
- apps/workbench/src/features/workbench/WorkbenchShell.tsx — integrated import/merge.
- apps/workbench/src/features/workbench/knowledge.tsx — question/claim forms and branching.
- apps/workbench/src/domain/{records,history,retrieval}.ts — provenance/projections/search.
- apps/workbench/src/features/workbench/{now,map}.tsx — resumption and graph.
- apps/workbench/src/content/markdown.tsx — renderer scope.
- apps/workbench/test/{store,knowledge}.test.ts — relevant regression gaps.
- apps/workbench/scripts/browser.mjs and .github/workflows/private-workbench.yml — reported checks versus CI coverage.

## Shell, panels and layout
- Bridge Note: https://github.com/blackmath88/bridge-note-react
- Shell donor: https://github.com/blackmath88/bridge-note-react/blob/main/src/components/workshop/app-shell.tsx
- Preferences: https://github.com/blackmath88/bridge-note-react/blob/main/src/hooks/use-layout-preferences.ts
  Borrow spatial mechanics and persistence intent. Do not transplant workshop/session/presentation types, auth or D1. Its hook needs SSR/storage validation; shell presence does not prove arbitrary editor groups.
- VS Code layout: https://code.visualstudio.com/docs/configure/custom-layout
- VS Code sidebars: https://code.visualstudio.com/api/ux-guidelines/sidebars
  Predictable regions, group/dock distinction and focus/restore; do not embed VS Code merely for these mechanics.
- Obsidian tabs: https://obsidian.md/help/tabs
- Zed panels: https://zed.dev/blog/new-panel-system
  Peer source/note surfaces and restrained docks, not wholesale clones.
- Optional TanStack primitives: https://ui.shadcn.com/docs/installation/tanstack
  No starter migration merely to obtain controls. Review actual react-resizable-panels version/API/licence before adoption.

## Focused surfaces and visual hierarchy
- PDF Lab: https://github.com/blackmath88/baselhack26-open-presence/tree/main/sideprojects/pdf-lab/workbench
  Focused work surfaces/evidence inspector/accessibility; do not assume its PDF composition/palette suits every task.
- Linear: https://linear.app/now/how-we-redesigned-the-linear-ui
  Restraint, alignment and hierarchy, not universal issue-tracker semantics.
- Cisco overview: https://cloud.cisco.com/docs/en/cisco-cloud-control-overview/cisco-cloud-control-overview.html
- Cisco canvas: https://www.cisco.com/c/en/us/td/docs/ai/cisco-cloud-control/articles/cisco-cloud-control-canvas.html
  Inquiry/evidence/action continuity only. No proprietary assets or invented Cisco design tokens.

## Knowledge, maps and multiple views
- Brainstorm StateView: https://github.com/blackmath88/br-ai-nstorm/blob/main/src/components/StateView.tsx
- Brainstorm MapView: https://github.com/blackmath88/br-ai-nstorm/blob/main/src/components/MapView.tsx
- Brainstorm adoption: https://github.com/blackmath88/br-ai-nstorm/blob/main/docs/ADOPTION.md
  Typed interpretations, provenance, contradictions and projections. Adapt keyboard/list fallback, stable layout and reduced motion; do not inherit multi-person review unchanged.
- Obsidian Bases: https://obsidian.md/help/bases
  Multiple views over durable material rather than duplicate truth.
- ATT&CK Navigator: https://github.com/mitre-attack/attack-navigator
  Purposeful layers, not a giant mastery heatmap.

## Experiment and learning references
- Hex: https://learn.hex.tech/docs/getting-started/develop-your-notebook
- marimo: https://github.com/marimo-team/marimo
  Work plus outputs; notebook execution/embedding remains a separately authorized decision.
- PortSwigger paths: https://portswigger.net/web-security/learning-paths
  Prerequisites/practice, not competence percentages or permission to test arbitrary targets.

## Memory and retrieval
- Observstory memory contract: https://github.com/blackmath88/observstory/blob/main/docs/project-knowledge/MEMORY.md
- Knowledge Lab: https://github.com/blackmath88/baselhack26-knowledge-lab
- LightRAG: https://github.com/HKUDS/LightRAG
  Recheck host contracts, service status, private audience, corpus/version coverage and deletion. A snapshot is not live sync; an index is not canonical truth.

## Reuse checklist
For every donor: record exact revision, licence and asset rights; separate concepts from copied code; identify framework/backend/domain coupling; document changes and attribution; test SSR, storage, keyboard and mobile behaviour. Unknown rights mean inspect first, not permission inferred from public visibility.

No licences, service health or benchmark results were independently revalidated by this documentation transfer.
