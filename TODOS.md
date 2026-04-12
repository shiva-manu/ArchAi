# TODOS

## ArchAI v1
- [ ] **SSE pipeline streaming** — Refactor `ArchitectureService.generateArchitecture()` to emit step-complete events via SSE. 3-4 days. Depends on: nothing.
- [ ] **5 Architecture templates** — JSON files in `src/data/templates/`. Cards UI above textarea. ~2 hours. Depends on: nothing.
- [ ] **"What if?" tech swap** — Node dropdown → full pipeline rebuild. `techAlternatives.json` mapping. ~1 day. Depends on: SSE streaming (for progress visibility).
- [ ] **Export to Markdown** — Groq-formatted RFC with Mermaid diagram. User-initiated button. ~3 hours. Depends on: nothing.
- [ ] **Feedback button** — Thumbs up/down after generation. localStorage only. ~30 min. Depends on: nothing.
- [ ] **Light theme toggle** — ThemeProvider in main.tsx, CSS variables, dark variants. ~1-2 hours. Depends on: nothing.
- [ ] **Per-session rate limiting** — 10 generations max. Server-side. ~1 hour. Depends on: nothing.
- [x] **Tests** — No tests exist. Critical gap. Start with unit tests for `architecture.service.ts` pipeline. TBD effort. **Completed:** v0.1.1.0 (2026-04-12) — 47 tests: 33 server (schemas, helpers, retry) + 14 client (store, InputPanel). CI pipeline via GitHub Actions.

## Completed

- **Tests** — 47 tests with vitest + React Testing Library. CI on every push/PR. Completed in v0.1.1.0.

## v2 (Deferred)
- [ ] Server-side feedback collection endpoint
- [ ] User accounts + design persistence (database)
- [ ] Collaborative design review (comments, threads)
- [ ] Design template marketplace
- [ ] Design-to-implementation sync tracking
- [ ] Multi-provider AI (Anthropic, OpenAI as alternatives to Groq)
