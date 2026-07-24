import Fastify from 'fastify';

const server = Fastify({ logger: true });

server.get('/health', async () => {
    return {
        status: 'Online',
        architecture: 'Modular Monolith',
        timestamp: new Date().toISOString()
    };
});

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