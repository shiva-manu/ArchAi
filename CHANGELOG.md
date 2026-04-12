# Changelog

All notable changes to this project will be documented in this file.

## [0.1.1.0] - 2026-04-12

### Added
- Full test infrastructure — 47 tests across server (33) and client (14) covering Zod schemas, JSON parsing, retry logic, store state, and component rendering
- CI pipeline with GitHub Actions running both test suites on every push and PR
- TESTING.md with conventions, test layers, and running instructions
- CLAUDE.md with testing rules for AI-assisted development

### Changed
- Test scripts added to both server and client package.json (`npm test`, `npm run test:watch`)

## [0.1.0.0] - 2026-04-12

### Added
- AI-powered architecture generation from natural language descriptions — describe a system, get a full architecture diagram with React Flow visualization
- 6-step AI pipeline: requirements extraction → architecture decision → frontend architecture → graph generation → explanation → implementation guide
- Multi-provider AI support: Groq (default), Anthropic, Ollama with pluggable provider architecture
- Interactive architecture diagram with 11 custom node types, color-coded flow types, numbered step callouts, and group regions
- SSE streaming for build prompts — each diagram node gets a detailed build prompt generated sequentially
- 3-panel dashboard: input panel (description + scale), visualization (React Flow diagram), details/implementation guide panels
- Details panel with Architecture, Frontend, API Design, and Scaling tabs
- Implementation guide panel with project structure, development steps, tech stack, deployment guide, cost estimate, and best practices
- Zod validation schemas for all pipeline steps and API inputs
- Landing page and dashboard routes with React Router
- shadcn/ui component library with dark theme
