import 'dotenv/config';
import Fastify from 'fastify';
import { db } from './db';
import { activityEvents } from './modules/processing/schema';
import { desc } from 'drizzle-orm';

const server = Fastify({ logger: true });

server.get('/health', async () => {
    return { status: 'Online', architecture: 'Modular Monolith' };
});

server.post('/events', async (request, reply) => {
    const body = request.body as { eventType: string; payload: Record<string, any> };

    const [newEvent] = await db.insert(activityEvents).values({
        eventType: body.eventType || 'UNKNOWN',
        payload: body.payload || {},
    }).returning();

    return reply.status(201).send(newEvent);
});

server.get('/events', async () => {
    return db.select().from(activityEvents).orderBy(desc(activityEvents.createdAt)).limit(10);
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