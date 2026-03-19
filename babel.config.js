module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@gluestackui': './components/ui',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
