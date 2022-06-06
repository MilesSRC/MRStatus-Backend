import express from 'express';

type ReqMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options';

export default class Route {
    public path: string;
    public method: ReqMethod;
    public handler: (req: express.Request, res: express.Response) => void;

    constructor(path: string, method: ReqMethod, handler: (req: express.Request, res: express.Response) => void) {
        this.path = path;
        this.handler = handler;
        this.method = method;
    }

    public getRouter(): express.Router {
        let router = express.Router();
        router[this.method](this.path, this.handler);        
        return router;
    }
}