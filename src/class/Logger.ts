/**
 * A logger for anything to use to log its stuff.
 */
import chalk from 'chalk';

type Level = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export default class Logger {
    public name: string;
    public disregardEnv: boolean;
    private prefix: string;
    
    constructor(name: string, disregardEnv: boolean = false){
        this.name = name;
        this.disregardEnv = disregardEnv;
        this.prefix = `[${this.name}]`;
    }

    public log(level: Level, message: string){
        if(process.env.NODE_ENV == "development" || this.disregardEnv){
            console.log(`${this.prefix}${this.getLevelColor(level.charAt(0).toLocaleUpperCase() + level.slice(1))}: ${message}`);
        }
    }

    private getLevelColor(level: String): string {
        switch(level){
            case "Debug":
                return chalk.blue(`[${level}]`);
            case "Info":
                return chalk.green(`[${level}]`);
            case "Warn":
                return chalk.yellow(`[${level}]`);
            case "Error":
                return chalk.red(`[${level}]`);
            case "Critical":
                return chalk.bgRed(`[${level}]`);
            default:
                return chalk.blue(`[${level}]`);
        }
    }
}