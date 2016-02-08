var path = require('path');
var webpack = require('webpack');
// bar babel = require('babel-loader');

module.exports = {
    entry: './src/js/main.js',
    output: { path: '/public/dist/js', filename:'bundle.js'},
    node: {
      fs: "empty"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    // https://github.com/babel/babel-loader#options
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-2']
                }
            }
        ],
        preLoaders : [
            <% if(Eslint) {%>
                {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
            <% } %>
        ]
    },
    devtool: "source-map"
};