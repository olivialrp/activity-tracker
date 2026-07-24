import { db } from '../../db';
import { activityEvents } from './schema';

export async function saveActivityEvent(eventType: string, payload: Record<string, any>) {
    const [newEvent] = await db.insert(activityEvents).values({
        eventType,
        payload,
    }).returning();

    return newEvent;
}