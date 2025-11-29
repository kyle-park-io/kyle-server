const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Uncomment for bundle analysis
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  target: 'web',
  // Remove source-map in production for smaller bundle (use 'hidden-source-map' if needed for debugging)
  devtool: false,
  entry: './src/index.tsx',
  output: {
    clean: true,
    path: path.resolve(__dirname, 'static'),
    // Ingress reverse-proxy server prefix
    publicPath: '/blog-static/',
    // Assets output configuration
    filename: 'assets/[name].blog.[contenthash:8].js',
    chunkFilename: 'assets/[name].blog.[contenthash:8].js',
    assetModuleFilename: 'assets/[name].blog[ext]',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs'],
    alias: {
      '@public': path.resolve(__dirname, 'public'),
    },
  },
  // Optimization configuration
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.log in production
            drop_debugger: true,
          },
          format: {
            comments: false, // Remove comments
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    // Code splitting
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        // Vendor chunk for node_modules
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // Solid.js specific chunk
        solid: {
          test: /[\\/]node_modules[\\/](solid-js|solid-bootstrap|@solidjs)[\\/]/,
          name: 'solid',
          chunks: 'all',
          priority: 20,
        },
        // Common chunk for shared code
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    // Runtime chunk for better caching
    runtimeChunk: 'single',
  },
  // Build configuration
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8KB - inline smaller images
          },
        },
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  // Plugins
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new DotenvPlugin({
      path: './.env',
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].blog.[contenthash:8].css',
      chunkFilename: 'assets/[name].blog.[contenthash:8].css',
    }),
    new HtmlWebpackPlugin({
      template: 'index(webpack).html',
      inject: 'body',
      scriptLoading: 'defer',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: 'public' }],
    }),
    // Gzip compression
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240, // Only compress files > 10KB
      minRatio: 0.8,
    }),
    // Uncomment for bundle analysis
    // new BundleAnalyzerPlugin(),
  ],
  // Performance hints
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 512000, // 500KB
  },
};
