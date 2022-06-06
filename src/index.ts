/**
 * status.milesr.dev
 * 
 * Meant for monitoring all applications ran by milesr.dev
 */
import { config } from 'dotenv';
config(); // Load .env file

/* Load Security */
import Security from '@Classes/Security';
const security = new Security();

/* Create Container */
import Container from '@Classes/Container';
const container = new Container();

/* Start Socket.io */
import SocketServer from '@Classes/SocketServer';
const io = new SocketServer(process.env.SOCKET_PORT || 3001);

/* Start Server */
import Server from '@Classes/Server';
const server = new Server(process.env.PORT || 3000);

/* Expose Server, Container, IO, and Security to global scope */
global.server = server;
global.container = container;
global.io = io;
global.security = security;