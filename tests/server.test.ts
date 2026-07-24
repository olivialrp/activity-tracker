import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { ingestionRoutes } from '../src/modules/ingestion/routes';
import { analyticsRoutes } from '../src/modules/analytics/routes';
import { registerProcessingListeners } from '../src/modules/processing/listener';

describe('Modular Monolith Architecture Tests', () => {
    let server: FastifyInstance;

    beforeAll(async () => {
        server = Fastify();
        registerProcessingListeners();
        server.get('/health', async () => ({ status: 'Online', architecture: 'Modular Monolith' }));
        server.register(ingestionRoutes);
        server.register(analyticsRoutes);
        await server.ready();
    });

    afterAll(async () => {
        await server.close();
    });

    it('should return 200 OK on health check endpoint', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/health',
        });

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.payload)).toEqual({
            status: 'Online',
            architecture: 'Modular Monolith',
        });
    });

    it('should reject malformed event payloads with 400 Bad Request', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/events',
            payload: {
                eventType: 'X', // Fails Zod's .min(2) rule!
                payload: {},    // Added so it passes AJV structural routing
            },
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.payload);
        expect(body.error).toBe('Validation Error');
    });

    it('should accept valid event payloads with 202 Accepted', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/events',
            payload: {
                eventType: 'USER_CHECKOUT',
                payload: { cartTotal: 149.99, currency: 'USD' },
            },
        });

        expect(response.statusCode).toBe(202);
        const body = JSON.parse(response.payload);
        expect(body.status).toBe('Accepted');
    });
});