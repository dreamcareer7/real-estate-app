// @ts-nocheck
/* eslint-disable max-len */
const path = require('path')

const SentryCliPlugin = require('@sentry/webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const moment = require('moment')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const S3Plugin = require('webpack-s3-plugin')
const Webpackbar = require('webpackbar')

const env = process.env.NODE_ENV || 'development'
const __DEV__ = env === 'development'

function resolvePath(dirPath) {
  return path.resolve(__dirname, dirPath)
}

const postcssOptions = {
  plugins: [
    require('postcss-preset-env')(),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ]
}

module.exports = {
  mode: 'production',
  devtool: false,
  output: {
    pathinfo: false,
    publicPath: process.env.ASSETS_BASEURL
  },
  entry: path.resolve(__dirname, '../app/index.js'),
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          sourceMap: true
        },
        parallel: true,
        exclude: /grapesjs/
      })
    ]
  },
  resolve: {
    modules: [resolvePath('../app'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
    alias: {
      '@app': resolvePath('../app'),
      store: resolvePath('../app/stores'),
      actions: resolvePath('../app/store_actions'),
      assets: resolvePath('../app/static'),
      styles: resolvePath('../app/styles'),
      components: resolvePath('../app/views/components'),
      constants: resolvePath('../app/constants'),
      dashboard: resolvePath('../app/components/Dashboard'),
      hooks: resolvePath('../app/hooks'),
      models: resolvePath('../app/models'),
      reducers: resolvePath('../app/reducers'),
      routes: resolvePath('../app/routes'),
      partials: resolvePath('../app/components/Partials'),
      services: resolvePath('../app/services'),
      utils: resolvePath('../app/utils'),
      views: resolvePath('../app/views'),
      config: resolvePath('../config/public'),
      selectors: resolvePath('../app/selectors'),
      /* components */
      deals: resolvePath('../app/components/Pages/Dashboard/Deals'),
      crm: resolvePath('../app/components/Pages/Dashboard/Contacts'),
      animations: resolvePath('../app/animations'),
      fixtures: resolvePath('../tests/unit/fixtures')
    },
    fallback: {
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer')
    },
    roots: [resolvePath('../app')]
  },
  externals: {
    fs: '{}'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: false
            }
          }
        ]
      },
      {
        test: /\.woff(\?.*)?$/,
        use: [
          {
            loader:
              'file-loader?prefix=fonts/&name=[path][name].[ext]&mimetype=application/font-woff'
          }
        ]
      },
      {
        test: /\.woff2(\?.*)?$/,
        use: [
          {
            loader:
              'file-loader?prefix=fonts/&name=[path][name].[ext]&mimetype=application/font-woff2'
          }
        ]
      },
      {
        test: /\.otf(\?.*)?$/,
        use: [
          {
            loader:
              'file-loader?prefix=fonts/&name=[path][name].[ext]&mimetype=font/opentype'
          }
        ]
      },
      {
        test: /\.ttf(\?.*)?$/,
        use: [
          {
            loader:
              'file-loader?prefix=fonts/&name=[path][name].[ext]&mimetype=application/octet-stream'
          }
        ]
      },
      {
        test: /\.eot(\?.*)?$/,
        use: [
          {
            loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]'
          }
        ]
      },
      {
        test: /\.svg(\?.*)?$/,
        use: [
          {
            loader:
              'file-loader?prefix=fonts/&name=[path][name].[ext]&mimetype=image/svg+xml'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(mjml)$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.(njk)$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions
            }
          }
        ]
      },
      {
        test: /\.scss/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../app/index.html'),
      hash: false,
      filename: './index.html',
      inject: true,
      minify: {
        collapseWhitespace: false
      }
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
        E2E: JSON.stringify(process.env.E2E),
        APP_URL: JSON.stringify(process.env.APP_URL),
        RECHAT_API_URL: JSON.stringify(process.env.RECHAT_API_URL),
        SOCKET_SERVER: JSON.stringify(process.env.SOCKET_SERVER),
        COSMIC_BUCKET: JSON.stringify(process.env.COSMIC_BUCKET),
        COSMIC_KEY: JSON.stringify(process.env.COSMIC_KEY),
        CLOUDFRONT_URL: JSON.stringify(process.env.CLOUDFRONT_URL),
        IMGIX_URL: JSON.stringify(process.env.IMGIX_URL),
        BRANCH_KEY: JSON.stringify(process.env.BRANCH_KEY),
        APP_SHARE_URL: JSON.stringify(process.env.APP_SHARE_URL),
        GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
        ITUNES_URL: JSON.stringify(process.env.ITUNES_URL),
        RECHAT_FORMS_URL: JSON.stringify(process.env.RECHAT_FORMS_URL),
        RECHAT_STORE_URL: JSON.stringify(process.env.RECHAT_STORE_URL),
        AWS_ACCESS_KEY: JSON.stringify(process.env.AWS_ACCESS_KEY),
        AWS_SECRET_ACCESS_KEY: JSON.stringify(
          process.env.AWS_SECRET_ACCESS_KEY
        ),
        ASSETS_BUCKET: JSON.stringify(process.env.ASSETS_BUCKET),
        ASSETS_BASEURL: JSON.stringify(process.env.ASSETS_BASEURL),
        FB_APP_ID: JSON.stringify(process.env.FB_APP_ID),
        RECHAT_SPLITTER_URL: JSON.stringify(process.env.RECHAT_SPLITTER_URL),
        TENOR_API_KEY: JSON.stringify(process.env.TENOR_API_KEY),
        UNSPLASH_API_KEY: JSON.stringify(process.env.UNSPLASH_API_KEY),
        DROPBOX_APP_KEY: JSON.stringify(process.env.DROPBOX_APP_KEY),
        INTERCOM_APP_ID: JSON.stringify(process.env.INTERCOM_APP_ID),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
        SENTRY_ENVIRONMENT: JSON.stringify(process.env.SENTRY_ENVIRONMENT),
        SOURCE_VERSION: JSON.stringify(
          process.env.CI_COMMIT_REF_SLUG || process.env.SOURCE_VERSION
        ),
        MAPBOX_ACCESS_TOKEN: JSON.stringify(process.env.MAPBOX_ACCESS_TOKEN),
        STRIPE_PUBLIC_KEY: JSON.stringify(process.env.STRIPE_PUBLIC_KEY)
      },
      __DEV__,
      NODE_ENV: env,
      __DEBUG__: __DEV__,
      __PROD__: env === 'production'
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: 'sourcemaps/[name][hash].js.map'
    }),
    new MomentLocalesPlugin(),
    new CompressionPlugin({
      test: /\.(css|js)$/,
      filename: '[path][base]',
      deleteOriginalAssets: 'keep-source-map',
      threshold: 0, // S3 plugin expects all js assets to be gzipped
      minRatio: 1 // Therefore it adds a content-encoding to them all
    }),
    new SentryCliPlugin({
      release:
        process.env.CI_COMMIT_REF_SLUG || process.env.SOURCE_VERSION || '',
      include: 'dist/sourcemaps/',
      urlPrefix: `${process.env.ASSETS_BASEURL}sourcemaps/`
    }),
    new S3Plugin({
      progress: false, // Messes the terminal up
      exclude: /\.(html|map)$/,
      basePath: 'dist/',
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.ASSETS_REGION
      },
      s3UploadOptions: {
        Bucket: process.env.ASSETS_BUCKET,
        Expires: moment().utc().add('1', 'month').toDate(),
        ContentEncoding(fileName) {
          if (/\.(css|js)$/.test(fileName)) {
            return 'gzip'
          }
        },

        ContentType(fileName) {
          if (/\.js$/.test(fileName)) {
            return 'application/javascript'
          }

          if (/\.css$/.test(fileName)) {
            return 'text/css'
          }

          return 'text/plain'
        }
      },
      noCdnizer: true
    }),
    new Webpackbar()
  ].filter(Boolean)
}
