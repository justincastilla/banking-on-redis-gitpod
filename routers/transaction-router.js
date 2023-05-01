import { Router } from 'express'
import { redis } from '../om/client.js'
import { bankTransactionRepository as bankRepo  } from '../om/bankTransaction-repository.js'

export const transactionRouter = Router()

const FIVE_MINUTES = 1000 * 60 * 5
const TRANSACTIONS_STREAM = "transactions"
const BALANCE_TS = 'balance_ts';
const SORTED_SET_KEY = 'bigspenders';
let balance = 100000.00;

/* fetch all transactions up to five minutes ago */
transactionRouter.get('/balance', async (req, res) => {
  const balance = await redis.ts.range(
    BALANCE_TS,
    Date.now() - FIVE_MINUTES,
    Date.now())

  let balancePayload = balance.map((entry) => {
    return {
      'x': entry.timestamp,
      'y': entry.value
    }
  })
  res.send(balancePayload)
})

/* fetch top 5 biggest spenders */
transactionRouter.get('/biggestspenders', async (req, res) => {
  const range = await redis.zRangeByScoreWithScores(SORTED_SET_KEY, 0, Infinity)
  let series = []
  let labels = []

  range
    .slice(0,5)
    .forEach((spender) => {
    series.push(parseFloat(spender.score.toFixed(2)))
    labels.push(spender.value)
  })

  res.send({series, labels})

})


transactionRouter.get('/search', async (req, res) => {
  const term = req.query.term

  let results

  if(term.length>=3){
    /*
      REDIS CHALLENGE  4
      Add Redis to the `/search` endpoint
    */
    results = [{}]
  }
  res.send(results)
})

/* return ten most recent transactions */
transactionRouter.get('/transactions', async (req, res) => {

  /*
    REDIS CHALLENGE 2
    Add Redis to the `/transactions` endpoint
  */
  const transactions = []

  res.send(transactions)

})
