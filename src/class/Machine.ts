import Service from './Service';

interface Specs {
    cpu?: number;
    ram: number;
    disk: number;
    network: number;
}

export default class Machine {
    private name: string;
    private ip: string;
    private url: string;
    
    private capabilities: Specs;
    private services: Map<string, Service> = new Map();
    private online: boolean = false;

    public constructor(name: string, ip: string, url: string, capabilities: Specs) {
        this.name = name;
        this.ip = ip;
        this.url = url;
        this.capabilities = capabilities;
    }

    public getName(): string {
        return this.name;
    }

    public isOnline(): boolean {
        return this.online;
    }

    public getIp(): string {
        return this.ip;
    }

    public getUrl(): string {
        return this.url;
    }

    public getCapabilities(): Specs {
        return this.capabilities;
    }

    public getServices(): Map<string, Service> {
        return this.services;
    }

    public getService(name: string): Service | undefined {
        return this.services.get(name);
    }

    public addService(service: Service): void {
        if (this.hasService(service.getName())) {
            return;
        }

        this.services.set(service.getName(), service);
    }

    public hasService(service: string): boolean {
        return this.services.has(service);
    }

    public setOnline(online: boolean): void {
        this.online = online;
    }

    public toJSON(): object {
        return {
            name: this.name,
            ip: this.ip,
            url: this.url,
            online: this.online,
            capabilities: this.capabilities,
            services: Array.from(this.services.values()).map(service => service.toJSON())
        };
    }
}