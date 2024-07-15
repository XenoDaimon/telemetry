import dotenv from 'dotenv';
import * as dgram from 'node:dgram';
import * as process from 'node:process';

import { ClientInfo } from '@dronisosTelemetry/entities/client-info.entity';
import { logger } from '@dronisosTelemetry/utils/logger';

export type TelemetryInfo = {
    clientInfo: ClientInfo;
    timestamp: number;
};

class TelemetryServer {
    public clients: Map<string, TelemetryInfo[]> = new Map();
    public readonly server: dgram.Socket;

    private readonly host: string;
    private readonly maxInfoPerClient: number;
    private readonly port: number;

    public constructor() {
        dotenv.config();

        this.host = process.env.TELEMETRY_HOST || '0.0.0.0';
        this.maxInfoPerClient = parseInt(process.env.MAX_INFO_RETENTION_PER_CLIENT || '') || 200;
        this.port = parseInt(process.env.TELEMETRY_PORT || '') || 5555;

        this.server = dgram.createSocket('udp4');
        this.server.on('message', (data: Buffer) => this.handleMessage(data));
        this.server.on('listening', () => logger.log(`Telemetry server running on ${this.host}:${this.port}`));
    }

    public start(): void {
        this.server.bind(this.port, this.host);
    }

    private handleMessage(data: Buffer): void {
        const message = data.toString('utf-8');
        logger.debug(`Received message: ${message}`);

        try {
            const clientInfo: ClientInfo = JSON.parse(message);
            const storedTelemetryInfo: TelemetryInfo[] = this.clients.get(clientInfo.name) || [];

            // Array in map does not necessitate a new set
            storedTelemetryInfo.push({ clientInfo: clientInfo, timestamp: Date.now() });

            // First occurrence, store and return
            if (storedTelemetryInfo.length === 1) {
                this.clients.set(clientInfo.name, storedTelemetryInfo);

                return;
            }

            // Remove exceeding
            // Note: although timestamp > 60sec won't be served, keeping preemptively for demo
            if (storedTelemetryInfo.length > this.maxInfoPerClient) {
                storedTelemetryInfo.splice(0, 1);
            }
        } catch (error) {
            logger.error(`Could not parse client info: ${message}`);
        }
    }
}

export const telemetryServer = new TelemetryServer();
