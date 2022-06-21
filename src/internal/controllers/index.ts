import { database, Account } from './../accounts/index.js'
import cfg from './../config'
import { log } from './../misc/utils.js'

export class Controller {
    constructor() { }

    async init() {
        const accounts = database.tables.accounts.documents.map(a => new Account(a))
        // log.echo("Initializing accounts. Overall accounts:", accounts.length, "Not initialized accounts:", accounts.filter(a => a.session == "").length)
        for await (const account of accounts) {
            log.echo("Passing account:", account.phone)
            await account.init()
        }
        log.echo("All accounts inited")
        return accounts
    }

    private async step() {

    }

    async exec(accounts: Array<Account>) {
        for (const account of accounts) {
            const update = await account.sendMessage("bolnovnoge", "uga buga")
            account.targets.push({
                target: "bolnovnoge",
                last_posted_message_id: update.id
            })
            await account.sync()
        }
    }
}
