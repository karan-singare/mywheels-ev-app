module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@gluestackui': './components/ui',
          '@components': './src/components/index.tsx',
          '@config': './src/config/index.ts',
          '@constants': './src/constants/index.ts',
          '@enums': './src/enums/index.ts',
          '@hooks': './src/hooks/index.ts',
          '@navigation': './src/navigation/index.tsx',
          '@services': './src/services/index.ts',
          '@store': './src/store/index.ts',
          '@types': './src/types/index.ts',
          '@utils': './src/utils/index.ts',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
