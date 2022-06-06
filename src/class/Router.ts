import Route from '@Classes/Route';
import Logger from '@Classes/Logger';

import express from 'express';
import fs from 'fs';

interface RouterSettings {
    app: express.Application;
    routes: string;
    base: string;
}

export default class Router {
    private base: string;
    private app: express.Application;
    private logger: Logger;
    public routes: Route[] = [];

    constructor(settings: RouterSettings){
        this.app = settings.app;
        this.base = settings.base;
        this.logger = new Logger("Router");

        /* Load routes */
        this.logger.log("info", `Loading routes...`);

        let files = fs.readdirSync(settings.routes);
        for(let file of files){
            if(file.endsWith(".js")){
                import(`${settings.routes}/${file}`).then(module => {
                    /* If module is a route, add it normally. if its an array of routes, add all of them */
                    if(module.default instanceof Route){
                        this.addRoute(module.default);
                    } else if(module.default instanceof Array){
                        for(let route of module.default){
                            this.addRoute(route);
                        }
                    }
                }).catch(err => {
                    /* Log the error */
                    this.logger.log("error", `Error loading route: ${file}`);
                    this.logger.log("error", err);
                });
            }
        }
    }

    public addRoute(route: Route): void {
        /* Register Route */                  
        this.logger.log("info", `Registering route: ${route.method.toUpperCase()} ${route.path}`);
        this.routes.push(route);
        this.app.use(this.base, route.getRouter());
    }
}