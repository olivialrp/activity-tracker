import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eventBus } from '../../shared/eventBus';

const eventIngestionSchema = z.object({
    eventType: z.string().min(2).max(50),
    payload: z.record(z.string(), z.any()),
});

export async function ingestionRoutes(server: FastifyInstance) {
    server.post(
        '/events',
        {
            schema: {
                description: 'Ingest a new activity event for background processing',
                body: {
                    type: 'object',
                    required: ['eventType', 'payload'],
                    properties: {
                        eventType: { type: 'string', examples: ['USER_CHECKOUT'] },
                        payload: {
                            type: 'object',
                            additionalProperties: true,
                            examples: [{ cartTotal: 149.99, currency: 'USD', item: 'Mechanical Keyboard' }],
                        },
                    },
                },
            },
        },
        async (request, reply) => {
            const parseResult = eventIngestionSchema.safeParse(request.body);

            if (!parseResult.success) {
                return reply.status(400).send({
                    error: 'Validation Error',
                    details: parseResult.error.flatten(),
                });
            }

            const { eventType, payload } = parseResult.data;
            eventBus.emit('activity:received', { eventType, payload });

            return reply.status(202).send({
                status: 'Accepted',
                message: 'Activity event queued for background processing',
            });
        }
    );
}