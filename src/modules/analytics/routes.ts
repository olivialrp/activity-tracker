import { FastifyInstance } from 'fastify';
import { db } from '../../db';
import { activityEvents } from '../processing/schema';
import { desc, sql } from 'drizzle-orm';

export async function analyticsRoutes(server: FastifyInstance) {
    server.get('/events', async () => {
        return db.select().from(activityEvents).orderBy(desc(activityEvents.createdAt)).limit(20);
    });

    server.get('/analytics/summary', async () => {
        const summary = await db
            .select({
                eventType: activityEvents.eventType,
                count: sql<number>`count(${activityEvents.id})`,
            })
            .from(activityEvents)
            .groupBy(activityEvents.eventType);

        return { totalCategories: summary.length, data: summary };
    });
}