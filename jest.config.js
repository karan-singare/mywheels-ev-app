module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@reduxjs/toolkit|immer|redux|redux-thunk|reselect|react-redux|react-native-mmkv|@gluestack-ui|react-native-safe-area-context|react-native-screens|lucide-react-native|react-native-svg)/)',
  ],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/__mocks__/styleMock.js',
  },
};
