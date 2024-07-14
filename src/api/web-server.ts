import Fastify, { FastifyInstance } from "fastify";

export type WebServerOptions = {
    host: string;
    port: number;
};

export class WebServer {
    private fastify: FastifyInstance;

    public constructor(options: WebServerOptions) {
        this.fastify = Fastify({
            logger: true,
        });
    }

    private initialize() {

    }
}
