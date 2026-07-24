import { eventBus } from '../../shared/eventBus';
import { saveActivityEvent } from './service';

export function registerProcessingListeners() {
    eventBus.on('activity:received', async (data: { eventType: string; payload: Record<string, any> }) => {
        try {
            await saveActivityEvent(data.eventType, data.payload);
        } catch (err) {
            console.error('Failed to process event asynchronously:', err);
        }
    });
}