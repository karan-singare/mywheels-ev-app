/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

// Mock the GluestackUIProvider which depends on @gluestack-ui/core ESM modules
jest.mock('../components/ui/gluestack-ui-provider', () => ({
  GluestackUIProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock navigation module
jest.mock('../src/navigation', () => ({
  NavigationContainer: () => null,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import App from '../src/app';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
