import crypto from 'crypto';
import fs from 'fs';
import Logger from './Logger';

/**
 * Security Class:
 * - Meant for checking if a M2M token is valid & refreshing them every day
 */
export default class Security {
    private logger: Logger = new Logger("Security", true);
    private m2mToken: string;

    constructor() {
        this.logger.log('info', "Security class created");

        if(!fs.existsSync('./m2m.token')) {
            this.logger.log('info', "Generating new M2M token");
            this.m2mToken = this.generateM2MToken();
            fs.writeFileSync('./m2m.token', this.m2mToken);
        } else {
            this.logger.log('info', "Loading M2M token");
            this.m2mToken = fs.readFileSync('./m2m.token').toString();
        }
    }

    private generateM2MToken(): string {
        return crypto.randomBytes(256).toString('hex');
    }

    public isM2MTokenValid(token: string): boolean {
        return this.m2mToken === token;
    }
}