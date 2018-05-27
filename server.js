import { server } from './grpc'

const config = require('./config').rpc.server

server.run(config.port , config.host)