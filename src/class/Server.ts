import Router from '@Classes/Router';

import express from 'express';
import expressrl from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import Logger from './Logger';

export default class Server {
    private port: number|string;
    private app: express.Application;
    private router: Router;
    private logger: Logger = new Logger("Server", true);
    
    constructor(port: number|string) {
        /* Express */
        this.app = express();

        /* Middleware */
        this.app.use(helmet(), morgan('dev'), cors());
        this.app.use(express.json());
        this.app.use(expressrl({
            windowMs: 30 * 60000,
            max: 30 * 15,
            standardHeaders: true,
            legacyHeaders: false,
            message: { message: "👋 Too fast, try again later alligator!" }
        }))

        /* Routes */
        this.router = new Router({
            app: this.app,
            routes: `${__dirname}/../routes`,
            base: '/api'
        });

        /* Serve frontend */
        this.app.use(express.static(`${__dirname}/../frontend`));

        /* Start */
        this.port = port;
        this.app.listen(this.port, () => {
            this.logger.log('info', `Started on ${this.port}`);
        });
    }

    public use(...args: any[]): void {
        this.app.use(...args);
    }
}