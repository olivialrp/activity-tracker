import 'dotenv/config';
import Fastify from 'fastify';
import { ingestionRoutes } from './modules/ingestion/routes';
import { analyticsRoutes } from './modules/analytics/routes';
import { registerProcessingListeners } from './modules/processing/listener';

const server = Fastify({ logger: true });

registerProcessingListeners();

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