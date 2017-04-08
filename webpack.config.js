var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + '/public/chat.html',
  filename: 'chat.html',
  inject: 'body'
});

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    __dirname + '/app.js'
  ],
  output: {
    path: __dirname + '/public',
    filename: "index_bundle.js",
    publicPath: '/'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ["babel-loader"]}
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    HTMLWebpackPluginConfig
  ]
}
