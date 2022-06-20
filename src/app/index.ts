import { Controller } from './../internal/controllers/index.js'

export class App {
    constructor() {}

    async init() {
        return this
    }

    async run() {
        let ctl = new Controller()
        await ctl.exec()
    }
}
