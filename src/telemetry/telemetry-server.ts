import * as dgram from 'node:dgram';
import config from "@dronisos/telemetry/config.js";

export type TelemetryConfig = {
    host: string;
    port: number;
};

export type ClientInfo = {
    'name': string;
    'position': number[];
    'versions': {
        'firmware': string;
        'pcb': string;
    };
    "config": {
        'gps': boolean;
        'imu': boolean;
        'magnetometer': boolean
    };
};

export class TelemetryServer {
    public clients: Map<string, ClientInfo> = new Map();

    private server: dgram.Socket;

    public constructor() {
        this.server = dgram.createSocket('udp4');
        this.messageHandle();
    }

    public startServer(configuration: TelemetryConfig): void {
        this.server.bind(configuration.port, configuration.host);
        console.log(`Telemetry server listening on ${configuration.host}:${configuration.port}`);
    }

    private messageHandle(): void {
        this.server.on('message', (message) => {
            if (config.debug) {
                console.debug('Received new message', message);
            }

            try {
                const data = JSON.parse(message.toString('utf-8')) as ClientInfo;
                const previousInfo = this.clients.get(data.name);

                if (previousInfo) {
                    this.clients.set(data.name, Object.assign(previousInfo, data));
                }

                this.clients.set(data.name, data);
            } catch(error) {
                console.error('Could not handle latest message', error);
            }
        });
    }
}

const telemetryServer = new TelemetryServer();
export default telemetryServer;