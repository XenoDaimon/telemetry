import dotenv from 'dotenv';
import express, { Express } from 'express';
import * as process from 'node:process';

import { routes } from '@dronisosTelemetry/routes/routes';
import { telemetryServer } from '@dronisosTelemetry/telemetry/server';
import { logger } from '@dronisosTelemetry/utils/logger';

dotenv.config();

const app: Express = express();
const host: string = process.env.API_HOST || '0.0.0.0';
const port: number = parseInt(process.env.API_PORT || '') || 3000;

app.use(express.json());
app.use('/', routes);

app.listen(port, host, () => {
    logger.log(`API server running on ${host}:${port}`);
});

telemetryServer.start();
