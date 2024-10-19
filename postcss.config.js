module.exports = {
    plugins: [
      require('postcss-preset-env')({
        stage: 2,
        features: {
          'oklch-function': false,
        },
      }),
    ],
  };
  