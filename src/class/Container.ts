import Service from "@Classes/Service";
import Machine from "@Classes/Machine";
import Logger from "./Logger";

export default class Container {
    private machines: Map<String, Machine> = new Map();
    private logger: Logger = new Logger("Container", true);

    constructor(){
        this.logger.log('info', "Container created");
    }

    public getMachine(machine: string): Machine | undefined {
        return this.machines.get(machine);
    }

    public getMachines(): Map<String, Machine> {
        return this.machines;
    }

    public addMachine(machine: Machine): void {
        this.machines.set(machine.getName(), machine);
    }

    public hasMachine(machine: string): boolean {
        return this.machines.has(machine);
    }

    public addService(service: Service): void {
        let machine = this.machines.get(service.getMachine().getName());

        if(!machine)
            return this.logger.log('error', `Machine ${service.getMachine().getName()} not found`);

        machine.addService(service);
    }

    public hasService(service: string): boolean {
        for(let machine of this.machines.values()) {
            if(machine.hasService(service))
                return true;
        }

        return false;
    }

    public getService(service: string): Service | undefined {
        for(let machine of this.machines.values()) {
            if(machine.hasService(service))
                return machine.getService(service);
        }

        return undefined;
    }
}