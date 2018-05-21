const path = require('path')

module.exports = {
    entry: ['babel-polyfill', './client/src/index.js'],
    output: {
        path: path.resolve(__dirname, 'client/dist/scripts'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'client/dist'),
        publicPath: '/scripts/'
    },
    devtool: 'source-map'
}