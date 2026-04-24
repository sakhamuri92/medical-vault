module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === 'test';
  return {
    presets: [
      isTest
        ? 'babel-preset-expo'
        : ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
     plugins: [
      'react-native-reanimated/plugin', // Keep this, but ensure it is LAST
    ],
  };
};
