import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eventBus } from '../../shared/eventBus';

const eventIngestionSchema = z.object({
    eventType: z.string().min(2).max(50),
    payload: z.record(z.string(), z.any()),
});

export async function ingestionRoutes(server: FastifyInstance) {
    server.post('/events', async (request, reply) => {
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
    });
}