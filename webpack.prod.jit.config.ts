var webpack = require('webpack');
var path = require('path');
var clone = require('js.clone');
var webpackMerge = require('webpack-merge');
var config = require('./config.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');

export var commonPlugins = [
  new webpack.ContextReplacementPlugin(
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
    root('./src'),
    {
      // your Angular Async Route paths relative to this root directory
    }
  ),

  new webpack.DefinePlugin({
    API_URL: JSON.stringify(config[process.env.API_URL])
  }),

  // Loader options
  new webpack.LoaderOptionsPlugin({
    // minimize: true,
    // debug: false
  }),

];
export var commonConfig = {
  // https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [root('node_modules')]
  },
  context: __dirname,
  output: {
    publicPath: '',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      // TypeScript
      {test: /\.ts$/, use: ['awesome-typescript-loader', 'angular2-template-loader']},
      {test: /\.html$/, use: 'raw-loader'},
      {test: /\.css$/, use: 'raw-loader'},
      {test: /\.json$/, use: 'json-loader'},
      {test: /\.scss$/, loaders: ['raw-loader', 'sass-loader']}
    ],
  },
  plugins: [
    // Use commonPlugins.
  ]

};

// Client.
export var clientPlugins = [
  // MINIFY
  /*new webpack.optimize.UglifyJsPlugin({
    // beautify: true,
    // mangle: false,
    output: {
      comments: false
    },
    compress: {
      warnings: false,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
      negate_iife: false // we need this for lazy v8
    },
    sourceMap: false
  }),*/
  // static
  new CopyWebpackPlugin([
    {from: './src/static'},
  ])
];
export var clientConfig = {
  target: 'web',
  entry: './src/client',
  output: {
    path: root('dist/client')
  },
  node: {
    global: true,
    crypto: 'empty',
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
};


// Server.
export var serverPlugins = [
  /*new webpack.optimize.UglifyJsPlugin({
   // beautify: true,
   mangle: false, // to ensure process.env still works
   output: {
   comments: false
   },
   compress: {
   warnings: false,
   conditionals: true,
   unused: true,
   comparisons: true,
   sequences: true,
   dead_code: true,
   evaluate: true,
   if_return: true,
   join_vars: true,
   negate_iife: false // we need this for lazy v8
   },
   sourceMap: false
   }),*/

];
export var serverConfig = {
  target: 'node',
  entry: './src/server', // use the entry file of the node server if everything is ts rather than es5
  output: {
    filename: 'index.js',
    path: root('dist/server'),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {test: /@angular(\\|\/)material/, use: "imports-loader?window=>global"}
    ],
  },
  externals: includeClientPackages(
    /@angularclass|@angular|angular2-|ng2-|ng-|@ng-|angular-|@ngrx|ngrx-|@angular2|ionic|@ionic|-angular2|-ng2|-ng/
  ),
  node: {
    global: true,
    crypto: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  }
};

export default [
  // Client
  webpackMerge(clone(commonConfig), clientConfig, {plugins: clientPlugins.concat(commonPlugins)}),

  // Server
  webpackMerge(clone(commonConfig), serverConfig, {plugins: serverPlugins.concat(commonPlugins)})
];


// Helpers
export function includeClientPackages(packages, localModule?: string[]) {
  return function (context, request, cb) {
    if (localModule instanceof RegExp && localModule.test(request)) {
      return cb();
    }
    if (packages instanceof RegExp && packages.test(request)) {
      return cb();
    }
    if (Array.isArray(packages) && packages.indexOf(request) !== -1) {
      return cb();
    }
    if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
      return cb(null, 'commonjs ' + request);
    }
    return cb();
  };
}

export function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
