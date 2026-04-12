## Testing

100% test coverage is the goal — tests make vibe coding safe.

- **Server:** `cd ArchAi-server && npm test` (Vitest)
- **Client:** `cd ArchAi-client && npm test` (Vitest + React Testing Library)
- See TESTING.md for conventions and patterns.

When writing new functions, write a corresponding test.
When fixing a bug, write a regression test.
When adding error handling, write a test that triggers the error.
When adding a conditional (if/else, switch), write tests for BOTH paths.
Never commit code that makes existing tests fail.
