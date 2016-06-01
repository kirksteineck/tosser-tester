module.exports = {
  entry: {
    app: './src/app.js',
    ad: './src/ad.js'
  },
  output: {
    path: './bin/',
    filename: '[name].bundle.js'
  },
  resolve: {
    modulesDirectories: ['node_modules']
  }
};
