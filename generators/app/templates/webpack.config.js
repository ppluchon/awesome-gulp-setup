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
                    presets: ['es2015', 'stage-1']
                }
            }
        ],
        preLoaders : [
            <% if(Eslint) {%>
                {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
            <% } %>
        ]
    },
    resolve: {
        alias: {
            'hogan': path.resolve('node_modules', 'hogan.js/lib/hogan.js'),
            // 'TweenLite': path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
            // 'TweenMax': path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
            // 'TimelineLite': path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
            // 'TimelineMax': path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
            // 'EasePack': path.resolve('node_modules', 'gsap/src/uncompressed/easing/EasePack.js'),
            // 'SplitText': path.resolve('__src', 'js/app/extra/SplitText.js'),
            // 'DrawSVGPlugin': path.resolve('__src', 'js/app/extra/DrawSVGPlugin.js'),
            // 'ColorPropsPlugin': path.resolve('__src', 'gsap/src/uncompressed/plugins/ColorPropsPlugin.js')
        },
        modulesDirectories: ['node_modules']
    },
    devtool: "source-map"
};