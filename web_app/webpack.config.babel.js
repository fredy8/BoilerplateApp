var fs = require('fs');
var React = require('react');
var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var R = require('ramda');

var pkg = require('./package.json');

var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH = path.resolve(__dirname);

var common = {
  entry: path.resolve(ROOT_PATH, 'src/main.jsx'),
  output: {
    path: path.resolve(ROOT_PATH, 'bin'),
    filename: 'bundle.js'
  }
};

var commonLoaders = [
  {
    test: /\.scss$/,
    loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
  },
  {
    test: /\.css$/,
    loaders: ['style', 'css?sourceMap']
  },
  { test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
  {
    test: /.*\.(gif|png|jpe?g|svg)$/i,
    loaders: [
      'file?hash=sha512&digest=hex&name=[hash].[ext]',
      'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
    ]
  }
];

var commonPlugins = [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /es/),
  new HtmlwebpackPlugin({
    title: '@@APP_TITLE@@',
    template: __dirname + '/src/templates/index.tpl',
    favicon: __dirname + '/src/App/assets/favicon.png'
  })
];

if(TARGET === 'start') {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    module: {
      loaders: commonLoaders.concat([
        {
          test: /\.jsx?$/,
          loaders: ['react-hot', 'babel'],
          include: path.resolve(ROOT_PATH, 'src')
        }
      ])
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true
    },
    plugins: commonPlugins.concat([
      new webpack.HotModuleReplacementPlugin()
    ])
  });
} else if(TARGET === 'build' || !TARGET) {
  module.exports = merge(common, {
    entry: {
      app: path.resolve(ROOT_PATH, 'src/main.jsx'),
      vendor: Object.keys(pkg.dependencies)
    },
    output: {
      path: path.resolve(ROOT_PATH, 'bin'),
      filename: 'app.[hash].js'
    },
    devtool: 'source-map',
    module: {
      loaders: commonLoaders.concat([
        {
          test: /\.jsx?$/,
          loaders: ['babel'],
          include: path.resolve(ROOT_PATH, 'src')
        }
      ])
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true
    },
    plugins: commonPlugins.concat([
      new Clean(['build']),
      new webpack.optimize.CommonsChunkPlugin(
        'vendor',
        'vendor.[hash].js'
      ),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': '"production"'
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]),
    externals: {
      jquery: '$',
      moment: 'moment',
      bluebird: 'Promise',
      ramda: 'R'
    }
  });
}
