# Endo Tracker - Testing Documentation

## Testing Framework Setup

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing.

### Test Structure

```
src/
├── components/
│   ├── EventForm.test.jsx
│   ├── EventList.test.jsx
│   └── TabNavigation.test.jsx
├── hooks/
│   ├── useFormState.test.js
│   └── useItemManager.test.js
├── utils/
│   └── timeUtils.test.js
├── tests/
│   └── integration.test.jsx
├── test-setup.js
└── App.test.jsx
```

### Available Test Scripts

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run specific test file
npx vitest EventForm.test.jsx

# Run tests matching pattern
npx vitest --run --reporter=verbose TabNavigation
```

### Test Categories

#### 1. Unit Tests
- **Component Tests**: Test individual React components in isolation
- **Hook Tests**: Test custom React hooks
- **Utility Tests**: Test utility functions

#### 2. Integration Tests
- **App Workflow Tests**: Test complete user workflows
- **Component Integration**: Test how components work together

### Test Coverage Areas

#### Components
- ✅ TabNavigation - Navigation functionality
- ✅ EventForm - Form interactions and validation
- ✅ EventList - Event display and editing
- ✅ App - Main application logic

#### Custom Hooks  
- ✅ useFormState - Form state management
- ✅ useItemManager - Item CRUD operations

#### Utilities
- ✅ timeUtils - Time formatting and conversion

#### Features Tested
- ✅ Event logging workflow
- ✅ Event editing and deletion
- ✅ Day-based grouping in History
- ✅ Settings management
- ✅ Data persistence (localStorage)
- ✅ Timezone handling
- ✅ Form validation
- ✅ Responsive interactions

### Mock Setup

The test environment includes mocks for:
- `localStorage` - For data persistence testing
- `window.confirm` and `window.alert` - For user interactions
- React Testing Library utilities - For DOM testing

### Best Practices

1. **Test Behavior, Not Implementation**: Tests focus on what users can do, not internal code structure
2. **User-Centric**: Tests simulate real user interactions (clicking, typing, etc.)
3. **Isolation**: Each test is independent and doesn't rely on others
4. **Clear Assertions**: Tests have descriptive names and clear expectations

### Example Test

```javascript
test('allows logging a pain event with details', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  // Select pain event type
  const painButton = screen.getByText('🩸 Pain Started');
  await user.click(painButton);
  
  // Fill in details
  const detailsInput = screen.getByPlaceholderText('Additional details...');
  await user.type(detailsInput, 'Sharp lower back pain');
  
  // Submit
  const submitButton = screen.getByText('Log Event');
  await user.click(submitButton);
  
  // Verify event appears
  expect(screen.getByText('Sharp lower back pain')).toBeDefined();
});
```

### Running Tests

To run the test suite:

```bash
# Run all tests once
npm run test:run

# Start test watcher for development
npm test
```

The test suite provides confidence that the app works correctly across different user scenarios and edge cases.
