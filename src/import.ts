import { database } from './internal/accounts/accountsDatabase.js'
import * as fs from 'fs'
import { log } from './internal/misc/utils.js'

const file = process.argv[2]

const delemiter = "\n"

const raw = fs.readFileSync(file).toString()
const lines = raw.replaceAll(/\r/g, '').split(delemiter)
for (const phone of lines) {
    let account = new database.ORM.Account({ phone: phone })
    if (!( await account.exists() )) {
        await account.sync()
        log.echo("Importing phone", phone)
    } else {
        log.error("Skiping phone", phone)
    }
}
