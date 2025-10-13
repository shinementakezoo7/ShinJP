# Testing

This directory contains all tests for the Japanese Learning Platform.

## Test Structure

```
tests/
├── unit/          # Unit tests
├── integration/   # Integration tests
└── e2e/           # End-to-end tests
```

## Running Tests

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### End-to-End Tests

```bash
npm run test:e2e
```

### All Tests

```bash
npm test
```

## Test Frameworks

- Jest for unit and integration tests
- Playwright for end-to-end tests

## Test Coverage

Run tests with coverage:

```bash
npm run test:coverage
```