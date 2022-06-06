import Logger from '@Classes/Logger';
import Connection from '@Classes/Connection';
import SocketIO from 'socket.io';
import { Socket } from 'socket.io';
import { connect } from 'http2';

export default class SocketServer {
    private io: SocketIO.Server;
    private connections: Connection[] = [];
    private logger: Logger = new Logger("WS", true);

    constructor(server: Express.Application) {
        this.io = new SocketIO.Server(server);

        this.io.on('connection', (socket: Socket) => {
            let connection = new Connection(this.io, socket);
            this.connections.push(connection);
        });

        
        this.logger.log('info', `Started`);
    }

    public getIO(): SocketIO.Server {
        return this.io;
    }
}