# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your instincts, and ship with confidence — without them, vibe coding is just yolo coding. With tests, it's a superpower.

## Frameworks

- **Server (ArchAi-server):** Vitest
- **Client (ArchAi-client):** Vitest + React Testing Library + jsdom

## Running Tests

```bash
# Server tests
cd ArchAi-server && npm test          # run once
cd ArchAi-server && npm run test:watch  # watch mode

# Client tests
cd ArchAi-client && npm test          # run once
cd ArchAi-client && npm run test:watch  # watch mode

# All tests
npm test --prefix ArchAi-server && npm test --prefix ArchAi-client
```

## Test Layers

### Unit tests
- Pure functions, services, utilities
- Where: `src/**/*.test.ts` next to the source file
- When: for every new function with conditional logic

### Component tests
- React components, UI interactions
- Where: `src/**/*.test.tsx` next to the component
- When: for every user-facing component with interaction

### Integration tests
- Full flows spanning multiple components/services
- Where: `tests/` directory for E2E flows
- When: for critical user journeys (generate → visualize → export)

## Conventions

- Test files live alongside source: `architecture.schema.test.ts` next to `architecture.schema.ts`
- Use `describe` / `it` / `expect` (Vitest globals enabled)
- Mock all external dependencies (AI providers, fetch, network)
- Test behavior, not implementation: `expect(result.entities).toContain('User')` not `expect(fn).toHaveBeenCalled()`
- When writing new functions, write a corresponding test
- When fixing a bug, write a regression test
- When adding error handling, write a test that triggers the error
- When adding a conditional (if/else, switch), write tests for BOTH paths
- Never commit code that makes existing tests fail
