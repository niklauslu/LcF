/**
 * copy模板
 */

const fs = require('fs')
const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')

let patterns = []

let ejsFromPath = path.join(__dirname, '../src/ejs')
let ejsToPath = path.join(__dirname , '../dist/ejs')

console.log('ejsFromPath ============', ejsFromPath)
patterns.push({
  from: ejsFromPath,
  to: ejsToPath
})

let opts = {}

module.exports = () => {
  return new CopyWebpackPlugin(patterns)
}

