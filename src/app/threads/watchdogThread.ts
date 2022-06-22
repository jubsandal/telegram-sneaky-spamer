import * as telegram from 'telegram'
import { parentPort, workerData } from 'node:worker_threads'

import { AnswerWatchdog } from './../../internal/watchdogs/index.js'
import cfg from './../../internal/config.js'

const wd = new AnswerWatchdog(workerData.accounts, {
    frequencyHz: cfg?.watchdog?.answer?.frequencyHz
})

wd.on("answer", (messages: telegram.helpers.TotalList<telegram.Api.Message>) => {
    parentPort!.postMessage(messages)
})
wd.start()
