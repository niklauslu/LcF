const merge = require('webpack-merge')
const config = require('./webpack.base')

module.exports = merge(config , {
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist'
    }
})