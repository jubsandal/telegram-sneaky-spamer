import * as accounts from './../accounts/index.js'
import cfg from './../config'

export class Controller {
    constructor() { }

    async exec() {
        const _accounts = accounts.database.tables.accounts.documents.map(a => new accounts.Account(a))
        for (const account of _accounts) {
            await account.init()
            await account.sendMessage("bolnovnoge", "this message sended by bot")
        }
    }
}
