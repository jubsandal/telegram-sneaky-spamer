import { Account, database } from './../accounts/index.js'
import { EventEmitter } from 'events'
import { log, sleep } from './../misc/utils.js'

export interface WatchdogSettings {
    frequencyHz?: number
}

const defaultSettings = {
    frequencyHz: 1
}

export class Watchdog extends EventEmitter {
    private sleepTime: number // ms
    private terminated: boolean
    private _onIteration: boolean // pseudo mutex

    constructor(settings?: WatchdogSettings) {
        super()

        const _settings = {
            ...defaultSettings,
            ...settings
        }

        log.echo("Staring watchdog with frequency", _settings.frequencyHz + "Hz")

        this.terminated = true
        this._onIteration = false
        this.sleepTime = 1000/_settings.frequencyHz
    }

    terminate() {
        if (this.terminated = true) {
            throw "Watchdog already terminated"
        }
        this.terminated = true

        return new Promise(async resolve => {
            while (this._onIteration) {
                await sleep(100)
            }
            resolve
        })
    }

    start() {
        if (this.terminated == false) {
            throw "Watchdog already running"
        }

        this.terminated = false
        this.watch()
    }

    private async watch() {
        this._onIteration = true
        console.log("step")
        const accounts = database.tables.accounts.documents.map(a => new database.ORM.Account(a))
        for (const account of accounts) {
            if (account.session === "") {
                continue
            }
            for (const target of account.targets) {
                if (target.last_posted_message_id > 0) {
                    const apiAccount = new Account(account)
                    const messages = await apiAccount.getUnreadedMessages(target.target, {
                        id: target.last_posted_message_id
                    })

                    console.log("DEBUG: watchdog messages:", messages)
                    if (messages.length > 0) {
                        this.emit("answer", messages)
                    }
                }
            }
        }

        this._onIteration = false
        if (this.terminated) {
            return
        } else {
            await sleep(this.sleepTime)
            await this.watch()
        }
    }
}
