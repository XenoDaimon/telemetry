import { Request, Response, Router } from 'express';

import { telemetryRoutes } from '@dronisosTelemetry/routes/telemetry';

export const routes = Router();

routes.use('/telemetry', telemetryRoutes);

routes.get('/', (req: Request, res: Response): void => {
    res.send('Server running!');
});
