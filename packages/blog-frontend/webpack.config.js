const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

module.exports = {
  target: 'web',
  devtool: 'source-map',
  entry: './src/index.tsx',
  // Serve bundles and assets from the site root. Without this the injected
  // script tag is relative, so entering a nested route directly
  // (/devrel, /quant, ...) resolves it against that path and 404s.
  output: {
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs'],
    alias: {
      '@public': path.resolve(__dirname, 'public'),
    },
  },
  // Build configuration
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
  // Plugins
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
    }),
  ],
  // Development server
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      // public/ holds directories that share a name with a route
      // (public/devrel vs. the /devrel page). Without these, the static
      // middleware claims /devrel and redirects it to /devrel/ instead of
      // letting historyApiFallback hand it to the router.
      serveIndex: false,
      staticOptions: { redirect: false },
    },
    compress: true,
    port: 3002,
    historyApiFallback: true,
    // Proxy for CORS
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
