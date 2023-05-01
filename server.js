import 'dotenv/config.js'
import * as cron from 'node-cron'

import express from 'express'
import serveStatic from 'serve-static'
import bodyParser from 'body-parser'

import session from 'express-session'
import { RedisStackStore } from 'connect-redis-stack'
import { createBankTransaction } from './transactions/transactionsGenerator.js'
import { config } from './config.js'
import { redis, redis2 } from './om/client.js'
import { accountRouter } from './routers/account-router.js'
import { transactionRouter } from './routers/transaction-router.js'
import { WebSocketServer } from 'ws';

/* configure your session store */
const store = new RedisStackStore({
  client: redis,
  prefix: 'redisBank:',
  ttlInSeconds: 3600
})

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())
app.use(session({
  store: store,
  resave: false,
  saveUninitialized: false,
  secret: '5UP3r 53Cr37'
}))

// set up a basic web sockect server and a set to hold all the sockets
const wss = new WebSocketServer({ port: 80 })
const sockets = new Set()

// when someone connects, add their socket to the set of all sockets
// and remove them if they disconnect
wss.on('connection', socket => {
  sockets.add(socket)
  socket.on('close', () => sockets.delete(socket))
})

const streamKey = 'transactions'
let currentId = '$'

cron.schedule('*/10 * * * * *', async () => {

  createBankTransaction()

  /*
    REDIS CHALLENGE 3
    Read from the stream of transactions
  */

  
  const result = [ { name: 'transactions', messages: [ {} ] } ]
  const event = result[0].messages[0]
  sockets.forEach(socket => socket.send(JSON.stringify(event)))
  // update the current id so we get the next event next time
  currentId = id
});

app.use(serveStatic('static', { index: ['auth-login.html'] }))

/* bring in some routers */
app.use('/account', accountRouter)
app.use('/transaction', transactionRouter)

/* websocket poll response */
app.get('/api/config/ws', (req, res) => {
  res.json({"protocol":"ws","host":"localhost", "port": "80", "endpoint":"/websocket"})
})

app.post('/perform_login', (req, res) => {
  let session = req.session
  console.log(session)
  if(req.body.username == 'bob' &&
    req.body.password == 'foobared') {
      session=req.session;
      session.userid=req.body.username;
      res.redirect('/index.html')
  } else {
    res.redirect('/auth-login.html')
  }
})

/* start the server */
app.listen(config.expressPort, () => console.log("Listening on port", config.expressPort))
