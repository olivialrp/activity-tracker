import 'dotenv/config';
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { ingestionRoutes } from './modules/ingestion/routes';
import { analyticsRoutes } from './modules/analytics/routes';
import { registerProcessingListeners } from './modules/processing/listener';

const server = Fastify({ logger: true });

registerProcessingListeners();

server.register(swagger, {
    openapi: {
        info: {
            title: 'Activity Tracker — Modular Monolith API',
            description: 'Asynchronous event tracking and analytics backend built with TypeScript, Fastify, Drizzle ORM, and Zod.',
            version: '1.0.0',
        },
    },
});

server.register(swaggerUi, {
    routePrefix: '/docs',
});

server.get('/health', async () => {
    return { status: 'Online', architecture: 'Modular Monolith' };
});

server.register(ingestionRoutes);
server.register(analyticsRoutes);

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3000;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server running on port ${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();