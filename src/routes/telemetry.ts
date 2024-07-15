import dotenv from 'dotenv';
import { Request, Response, Router } from 'express';
import { query } from 'express-validator';
import * as process from 'node:process';

import { TelemetryInfo, telemetryServer } from '@dronisosTelemetry/telemetry/server';
import { isString } from '@dronisosTelemetry/utils/assertion';

dotenv.config();

export const telemetryRoutes = Router();

const maxTimestampDelta = parseInt(process.env.MAX_TIMESTAMP_DELTA || '') || 60000;

// Filter if timestamp was created more than 60 seconds ago
function filterOldest(value: TelemetryInfo): boolean {
    return value.timestamp > Date.now() - maxTimestampDelta;
}

function reduceAndFilterClients(
    previousValue: { [p: string]: TelemetryInfo[] },
    value: [name: string, telemetryInfo: TelemetryInfo[]],
): { [p: string]: TelemetryInfo[] } {
    return Object.assign(previousValue, { [value[0]]: value[1].filter(filterOldest) });
}

telemetryRoutes.get('/', [query('name').isString().optional()], (req: Request, res: Response): void => {
    const { name } = req.query;
    const clients: Map<string, TelemetryInfo[]> = telemetryServer.clients;

    if (name && isString(name)) {
        if (!clients.has(name)) {
            res.sendStatus(404);

            return;
        }

        res.json({
            clients: {
                [name]: clients.get(name)?.filter(filterOldest),
            },
        });

        return;
    }

    res.json({
        clients: [...clients.entries()].reduce(reduceAndFilterClients, {}),
    });
});
