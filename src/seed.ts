import 'dotenv/config';
import { db } from './db';
import { activityEvents } from './modules/processing/schema';

async function seed() {
    console.log('🌱 Seeding cloud database...');

    const sampleEvents = [
        { eventType: 'USER_LOGIN', payload: { userId: 'usr_101', browser: 'Chrome' } },
        { eventType: 'USER_LOGIN', payload: { userId: 'usr_102', browser: 'Firefox' } },
        { eventType: 'USER_CHECKOUT', payload: { cartTotal: 89.99, currency: 'USD', items: 3 } },
        { eventType: 'USER_CHECKOUT', payload: { cartTotal: 210.50, currency: 'USD', items: 1 } },
        { eventType: 'PAGE_VIEW', payload: { path: '/pricing', referrer: 'google.com' } },
        { eventType: 'PAGE_VIEW', payload: { path: '/docs', referrer: 'direct' } },
        { eventType: 'PAGE_VIEW', payload: { path: '/docs', referrer: 'direct' } },
    ];

    try {
        await db.insert(activityEvents).values(sampleEvents);
        console.log('✅ Seeding complete! Added 7 sample events to Neon PostgreSQL.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();