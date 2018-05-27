const {client} = require('./index')
const config = require('./../config').rpc.client

module.exports = (clientServiceName = 'default') => {
  return client(clientServiceName , config.port , config.host)
}