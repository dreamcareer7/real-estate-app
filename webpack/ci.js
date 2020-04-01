import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MomentLocalesPlugin from 'moment-locales-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

import webpackConfig from './base'
import appConfig from '../config/webpack'

webpackConfig.mode = 'production'

webpackConfig.optimization = {
  splitChunks: {
    chunks: 'all'
  }
}

function postcss() {
  return [require('autoprefixer')()]
}

webpackConfig.devtool = false

webpackConfig.output.pathinfo = false
webpackConfig.output.publicPath = process.env.ASSETS_BASEURL

webpackConfig.performance = {
  hints: 'warning',
  maxAssetSize: 200 * 1024,
  maxEntrypointSize: 300 * 1024
}

webpackConfig.entry = {
  app: [appConfig.compile.entry],
  vendor: appConfig.compile.vendors
}

webpackConfig.plugins.push(
  new webpack.optimize.AggressiveMergingPlugin(),
  new MomentLocalesPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].[hash].css'
  }),
  new OptimizeCSSAssetsPlugin(),
  new HtmlWebpackPlugin({
    template: appConfig.compile.template,
    hash: false,
    filename: 'app/index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: false
    }
  }),

  new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.js$|\.css$/,
    filename: '[path]'
  }),
  new ForkTsCheckerWebpackPlugin({
    /**
     * We want build to fail if there is a ts error
     */
    async: false,
    /**
     * react-scripts also sets this to true and the overhead is negligible
     * with respect to production build time
     */
    checkSyntacticErrors: true,
    useTypescriptIncrementalApi: true
  })
)

webpackConfig.module.rules.push({
  test: /\.(sa|sc|c)ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: postcss
      }
    },
    'sass-loader'
  ]
})

export default webpackConfig
