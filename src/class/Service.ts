import Machine from "./Machine";

export default class Service {
    private name: string;
    private description: string;
    private machine: Machine;
    private url: string;
    private port: number;
    private version: string;
    private process: {
        pid: string,
        ram: number,
        cpu: number,
    }

    private online: boolean = false;

    public constructor(name: string, description: string, machine: Machine, url: string, port: number, version: string, process: {
        pid: string,
        ram: number,
        cpu: number,
    }) {
        this.name = name;
        this.description = description;
        this.machine = machine;
        this.url = url;
        this.port = port;
        this.version = version;
        this.process = process;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public isOnline(): boolean {
        return this.online;
    }

    public getMachine(): Machine {
        return this.machine;
    }

    public getUrl(): string {
        return this.url;
    }

    public getPort(): number {
        return this.port;
    }

    public getVersion(): string {
        return this.version;
    }

    public getProcess(): {
        pid: string,
        ram: number,
        cpu: number,
    } {
        return this.process;
    }

    public setProcess(process: {
        pid: string,
        ram: number,
        cpu: number,
    }): void {
        this.process = process;
    }

    public setPort(port: number): void {
        this.port = port;
    }

    public setUrl(url: string): void {
        this.url = url;
    }

    public setMachine(machine: Machine): void {
        this.machine = machine;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setVersion(version: string): void {
        this.version = version;
    }

    public setOnline(online: boolean): void {
        this.online = online;
    }

    public toJSON(): any {
        return {
            name: this.name,
            description: this.description,
            online: this.online,
            machine: this.machine.getName(),
            url: this.url,
            port: this.port,
            version: this.version,
            process: this.process,
        };
    }
}