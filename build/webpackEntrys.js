const fs = require('fs')
const path = require('path')

let entrys = {}

const vender = ['babel-polyfill']
entrys.vender = vender

const entrysJsPath = path.join(__dirname , '../src/js')

let entryPaths = fs.readdirSync(entrysJsPath)

entryPaths.forEach(entry => {
  let entryPath = path.join(entrysJsPath , entry)
  if (fs.statSync(entryPath).isFile()){
    let entryKey = entry.replace('.js' , '')
    entrys[entryKey] = entryPath
  }
})

console.log(entrys)
module.exports = entrys