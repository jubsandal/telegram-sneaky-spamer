import { Controller } from './../internal/controllers/index.js'
import { log } from './../internal/misc/utils.js'
import {
    Worker,
    isMainThread,
    parentPort,
    workerData
} from 'node:worker_threads'

export class App {
    constructor() {}

    async init() {
        return this
    }

    async run() {
        let ctl = new Controller()
        // inited accounts
        const accounts = await ctl.init()
        let AnswerWatchdog: Worker

        // const accountsBuffer = new SharedArrayBuffer(accounts.length)

        AnswerWatchdog = new Worker("./dist/app/threads/watchdogThread.js", {
            workerData: {
                path: "./src/app/threads/watchdogThread.js",
                accounts: accounts
            }
        })

        AnswerWatchdog.on("message", (m) => console.log("DEBUG post message:", m))
        AnswerWatchdog.on("error",   (e) => log.error("Watchdog error:", e))
        AnswerWatchdog.on("exit",    (code) => {
            if (code !== 0) {
                throw new Error("Answer watchdog exit error. code: " + code)
            }
        })

        await ctl.exec(accounts)
    }
}
