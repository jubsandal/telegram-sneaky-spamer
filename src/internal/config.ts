import { union, Describe, optional, array, enums, Infer, assert, boolean, object, number, string } from 'superstruct'
import { readFileSync } from 'fs'
import * as fs from 'fs'

const _cfg_path = './config.json'

const ConfigSign = object({
    path: object({
        storage: string(),
        sessions: string(),
        log: string(),
    }),

    watchdog: optional(
        object({
            answer: optional(
                object({
                    frequencyHz: optional(number())
                })
            )
        })
    ),

    accounts: object({
        dailyMessagesLimit: number(),
        sleepTime: object({
            min: number(), // ms
            max: number(), // ms
        })
    }),

    spamList: array(
        object({
            inputPeer: number(),
            accessHash: optional(string()),
        })
    ),

    tgApp: object({
        api_id: number(),
        api_hash: string()
    }),

    proxy: array(
        object({
            host: string(),
            port: number(),
            auth: object({
                user: string(),
                password: string()
            })
        })
    )
})

if (!fs.existsSync(_cfg_path)) {
    let cfg: ConfigType = {
        accounts: {
            dailyMessagesLimit: 50,
            sleepTime: {
                min: 30 * 60 * 1000,
                max: 60 * 60 * 1000,
            }
        },
        tgApp: {
            api_id: 0,
            api_hash: "0"
        },
        path: {
            log: './.log',
            sessions: './sessions',
            storage: './database'
        },
        spamList: [],
        proxy: []
    }
    fs.writeFileSync(_cfg_path, JSON.stringify(cfg, null, " ".repeat(4)))
}

type ConfigType = Infer<typeof ConfigSign>

    export function Config(): ConfigType {
        let config
        try {
            config = JSON.parse(readFileSync(_cfg_path).toString());
        } catch(e) {
            throw new Error("Config parse error: " + e);
        }

        assert(config, ConfigSign);

        return config;
    }

const cfg = Config()

for (const path of Object.values(cfg.path)) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

export default cfg
