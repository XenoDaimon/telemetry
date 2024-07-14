import { WebServer } from '@dronisos/telemetry/api/web-server.js';
import telemetryServer, { TelemetryServer } from '@dronisos/telemetry/telemetry/telemetry-server.js';
import { program } from 'commander';
import config from '@dronisos/telemetry/config.js';

type ApplicationConfiguration = {
    apiHost: string;
    apiPort: number;
    serverHost: string;
    serverPort: number;
};

class DronisosTelemetry {
    private applicationConfiguration!: ApplicationConfiguration;
    private telemetryServer!: TelemetryServer;
    private webServer!: WebServer;

    public constructor() {
        this.parseArguments();
        this.startTelemetryServer();
        this.startWebServer();
    }

    private parseArguments(): void {
        program
            .name('Dronisos Telemetry')
            .description('Telemetry server with API')
            .version('1.0.0');

        program
            .option('-wH, --web-host <host>', 'Web server host', 'localhost')
            .option('-wP, --web-port <port>', 'Web server port', '3000')
            .option('-tH, --telemetry-host <host>', 'Telemetry server host', 'localhost')
            .option('-tP, --telemetry-port <port>', 'Telemetry server port', '5555')
            .option('-D, --debug', 'Print debug information', false)
            .parse();

        const options = program.opts();

        this.applicationConfiguration = {
            apiHost: options.wH,
            apiPort: parseInt(options.wP, 10),
            serverHost: options.tH,
            serverPort: parseInt(options.tP, 10),
        };

        config.debug = options.debug;
    }

    private startTelemetryServer(): void {
        this.telemetryServer = telemetryServer.({
            host: this.applicationConfiguration.serverHost,
            port: this.applicationConfiguration.serverPort
        });
    }

    private startWebServer(): void {
        this.webServer = new WebServer({
            host: this.applicationConfiguration.apiHost,
            port: this.applicationConfiguration.apiPort,
        });
    }
}

const application = new DronisosTelemetry();