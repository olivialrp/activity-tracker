import { pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const activityEvents = pgTable('activity_events', {
    id: serial('id').primaryKey(),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});