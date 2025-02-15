const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

module.exports = {
  target: 'web',
  devtool: 'source-map',
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs'],
    alias: {
      '@public': path.resolve(__dirname, 'public'),
    },
  },
  // build
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', '@babel/preset-env', 'solid'],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
      // {
      //   test: /\.m?js$/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: ["@babel/preset-env"],
      //     },
      //   },
      //   exclude: /node_modules/,
      // },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  // plugin
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new DotenvPlugin({
      path: './.env',
      // safe: true,
    }),
    new HtmlWebpackPlugin({
      template: 'index(webpack).html',
      inject: 'body',
      scriptLoading: 'defer',
      // scriptLoading: 'module',
    }),
  ],
  // dev-server
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3001,
    historyApiFallback: true,
    // proxy(cors)
    proxy: [
      {
        context: ['/api', '/api-chat'],
        target: 'https://jungho.dev',
        // pathRewrite: { '^/api/': '' },
        changeOrigin: true,
        // secure: false,
      },
    ],
  },
};
