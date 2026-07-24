import Fastify from 'fastify';
import { describe, it, expect } from 'vitest';

const buildServer = () => {
    const server = Fastify();
    server.get('/health', async () => {
        return { status: 'Online', architecture: 'Modular Monolith' };
    });
    return server;
};

describe('Server Contract Tests', () => {
    it('should successfully return status Online on GET /health', async () => {
        const app = buildServer();

        // Simulates an HTTP request without opening a physical network port
        const response = await app.inject({
            method: 'GET',
            url: '/health'
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            status: 'Online',
            architecture: 'Modular Monolith'
        });
    });
});