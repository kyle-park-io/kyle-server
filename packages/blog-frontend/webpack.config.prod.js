const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
// optimize
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  target: 'web',
  devtool: 'source-map',
  entry: './src/index.tsx',
  output: {
    clean: true,
    path: path.resolve(__dirname, 'static'),
    // ingress(proxy) server prefix-
    publicPath: '/blog-static/',
    // assets
    filename: 'assets/[name].blog.[contenthash].js',
    chunkFilename: 'assets/[name].blog.[contenthash].js',
    assetModuleFilename: 'assets/[name].blog[ext]',
  },
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
            presets: ['@babel/preset-env', '@babel/preset-typescript', 'solid'],
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
      //     loader: "babel-loader", // Babel 로더 사용
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
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: 'public' }],
    }),
    // // optimize
    // new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    // new CompressionPlugin(),
  ],
};
