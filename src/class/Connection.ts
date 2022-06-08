import Logger from "./Logger";
import Machine from "./Machine";
import SocketIO from "socket.io";
import Joi from "joi";
import Service from "./Service";

interface Specs {
    cpu?: number;
    ram: number;
    disk: number;
    network: number;
}

interface MachineData {
    name: string;
    ip: string;
    url: string;
    capabilities: Specs;
}

interface ServiceData {
    name: string;
    description: string;
    machine: string;
    url: string;
    port: number;
    version: string;
    process: {
        pid: string,
        ram: number,
        cpu: number,
    }
}

interface MachineUpdateData {} // Will be empty

interface ServiceUpdateData {
    data: {
        process: {
            pid: string,
            ram: number,
            cpu: number,
        }
    }
}

interface SubmittedData {
    type: "machine" | "service";
    [key: string]: any;
}

const SpecSchema = Joi.object({
    cpu: Joi.number(),
    ram: Joi.number().required(),
    disk: Joi.number().required(),
    network: Joi.number().required(),
});

const SubmittedDataSchema = Joi.object({
    type: Joi.string().valid("machine", "service").required(),
    data: Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        ip: Joi.string(),
        url: Joi.string().required(),
        port: Joi.number(),
        capabilities: SpecSchema,
        usage: SpecSchema,
    }).required(),
}).required();

const blankspec = {
    cpu: 0,
    ram: 0,
    disk: 0,
    network: 0
}

export default class Connection {
    private server: SocketIO.Server;
    private socket: SocketIO.Socket;
    private logger: Logger;

    private system?: Machine | Service;

    private authorized: boolean = false;
    private security = global.security;
    private container = global.container;

    constructor(server: SocketIO.Server, socket: SocketIO.Socket) {
        this.server = server;
        this.socket = socket;
        this.logger = new Logger(`WSC-${this.socket.id.slice(0,5)}`);
        this.logger.log('info', `Connected`);

        /* Say hi */
        this.socket.send("Hello");

        /* Create listeners */
        this.socket.on('update', this.onUpdate.bind(this));
        this.socket.on('submitData', this.onSubmitData.bind(this));
        this.socket.on('authorize', this.onAuthorize.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));
    }

    private onUpdate(data: any): void {
        /* Make sure service exists */
        if(!this.system)
            return;

        /* Parse data into correct datatype based on this.service type */
        let updateData;

        if(this.system instanceof Machine)
            return;
        
        updateData = data as ServiceUpdateData;
        this.system.setProcess(updateData.data.process);           
        this.system.setOnline(true);
        this.logger.log("debug", "Updated");
    }

    private onSubmitData(data: SubmittedData): any {
        if(!this.authorized) {
            this.logger.log('error', `Not authorized`);
            this.socket.send(`NotAuthorizedException`);
            this.socket.disconnect();
            return;
        }

        let valid = SubmittedDataSchema.validate(data);

        if(!valid)
            return this.logger.log('error', `Invalid data`), this.socket.send(`InvalidDataException`);

        if(data.type === "machine") {
            let mData = data.data as MachineData;

            if(container.hasMachine(mData.name)){
                /* Silently ignore and just set machine */
                this.system = container.getMachine(mData.name);
                this.system?.setOnline(true);
            } else {
                /* Create machine */
                this.logger.log('info', `👋 Hi, I'm ${mData.name} and I'm running @ ${mData.ip}`);
                this.system = new Machine(mData.name, mData.ip || "0.0.0.0", mData.url, mData.capabilities || blankspec);
                container.addMachine(this.system);
                this.system.setOnline(true);
                return this.socket.send(`DataAccepted`);
            }
        } else {
            let sData = data.data as ServiceData;

            /* Check if the machine for the service exists, if not, throw an error "MachineNotFoundException" otherwise, create service under machine in the container */
            if(!container.hasMachine(sData.machine)){
                this.logger.log('error', `Machine ${sData.machine} not found`);
                this.socket.send(`MachineNotFoundException`);
                return;
            }

            if(container.hasService(sData.name)){
                /* Silently ignore and just set service */
                this.system = container.getMachine(sData.machine).getService(sData.name);
                this.system?.setOnline(true);
                return this.socket.send(`DataAccepted`);
            }

            this.logger.log('info', `👋 Hi, I'm ${sData.name} and I'm running on ${sData.machine}`);
            this.system = new Service(sData.name, sData.description || "No description provided", container.getMachine(sData.machine), sData.url || "Not reachable", sData.port || 8080, sData.version, sData.process);
            this.system.setOnline(true);
            container.addService(this.system);
            return this.socket.send(`DataAccepted`);
        }
    }

    private onAuthorize(key: string): void {
        this.logger.log('info', `Authorizing ${key.slice(0, 10)}...`);

        if(this.security.isM2MTokenValid(key)) {
            this.authorized = true;
            this.logger.log('info', `Authorized`);
            this.socket.send("Authorized");
        } else {
            this.logger.log('error', `Authorization failed`);
            this.socket.send(`AuthorizationRejectException`);
            this.socket.disconnect();
        }
        
    }

    private onDisconnect(): void {
        if(this.system)
            this.system.setOnline(false);

        this.logger.log('info', `Disconnected`);
    }
}