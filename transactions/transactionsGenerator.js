import { redis } from '../om/client.js'
import { bankTransactionRepository } from '../om/bankTransaction-repository.js'
import * as source from './transaction_sources.js'
import { createAmount, getRandom, replacer } from './utilities.js'

let balance = 100000.00;

const BALANCE_TS = 'balance_ts';
const SORTED_SET_KEY = 'bigspenders';

const TRANSACTIONS_STREAM = "transactions"
const TRIM = {
  strategy: 'MAXLEN', // Trim by length.
  strategyModifier: '~', // Approximate trimming.
  threshold: 100 // Retain around 100 entries.
}

const streamBankTransaction = async (transaction) => {
  /* convert all numbers to strings */
  const preparedTransaction = JSON.parse(JSON.stringify(transaction, replacer))
  
  /*
    REDIS CHALLENGE 1
    Add Redis to the Transactions Generator - Add to stream
  */
  const result = ''

  return result
}

const createTransactionAmount = (vendor, random) => {

  let amount = createAmount()
  balance += amount
  balance = parseFloat(balance.toFixed(2))

  redis.ts.add(BALANCE_TS, '*', balance, {'DUPLICATE_POLICY':'first' })

  return amount
}

export const createBankTransaction = async () => {
  let vendorsList = source.source
  const random = getRandom()
  const vendor = vendorsList[random % vendorsList.length]
  
  const amount = createTransactionAmount(vendor.fromAccountName, random)
  const transaction = {
    id: random * random,
    fromAccount: Math.floor((random / 2) * 3).toString(),
    fromAccountName: vendor.fromAccountName,
    toAccount: '1580783161',
    toAccountName: 'bob',
    amount: amount,
    description: vendor.description,
    transactionDate: new Date(),
    transactionType: vendor.type,
    balanceAfter: balance
  }
  
  /* 
    REDIS CHALLENGE 0
    Create a BankTransaction JSON document
  */
  const bankTransaction = transaction

  streamBankTransaction(bankTransaction)
  console.log('Created bankTransaction')
  return bankTransaction
}
