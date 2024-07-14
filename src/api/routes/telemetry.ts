import { Type } from '@sinclair/typebox';
import {FastifyPluginAsync, FastifyReply, FastifyRequest} from 'fastify';
import telemetryServer, {ClientInfo} from "@dronisos/telemetry/telemetry/telemetry-server.js";

const routes: FastifyPluginAsync = async (server) => {
    server.get('/', {
        schema: {
            querystring: {
                name: {
                    nullable: true,
                    type: 'string',
                },
            },
            response: {
                200: Type.Object({
                    clients: Type.Array(Type.Object({
                        name: Type.String(),
                        position: Type.Array(Type.Number()),
                        versions: Type.Object({
                            firmware: Type.String(),
                            pcb: Type.String(),
                        }),
                        config: Type.Object({
                            gps: Type.Boolean(),
                            imu: Type.Boolean(),
                            magnetometer: Type.Boolean(),
                        }),
                    })),
                }),
            },
        },
    }, async function (request: FastifyRequest, _: FastifyReply): Promise<{clients: ClientInfo[]}> {
        if (request.query.name) {
            return {clients: [telemetryServer.clients.get(request.query.name)] };
        }

        return { clients: [...telemetryServer.clients.values()] };
    });
}

export default routes;