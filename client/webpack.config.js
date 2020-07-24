require('dotenv').config();
const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
console.log('port!!!', process.env.DEV_SERVER_PORT);

module.exports = {
  entry: {
    "main": './src/index.js'
  },
  target: 'web',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    alias: {
      Shared: path.resolve(__dirname, '../shared')
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    port: process.env.DEV_SERVER_PORT || 3000
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      templateContent: `
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Socket chat app</title>
        </head>
        <body style="margin: 0; padding: 0">
          <div id="root"></div>
        </body>
      </html>
      `
    })
  ]
}
