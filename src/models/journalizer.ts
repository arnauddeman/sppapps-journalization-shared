import { ENTITY_FIELDS } from '@sppapps-entity-shared';
import { JournalizedEvent } from './journalized-event';
import { JournalizedEventLevel } from './journalized-event-level';
import { JournalizedEventStatus } from './journalized-event-status';
import { JournalizerSettings } from './journalizer-settings';

export type Journalizer = (query: any, result: any, error: any) => JournalizedEvent;

export function generateJournalizer(settings: JournalizerSettings): Journalizer {
    return (query: any, jData: any, error: any) => {

        const jEvent: JournalizedEvent = {
            source: settings?.source,
            sourceType: settings?.sourceType,
            operation: settings?.operation,
        };

        if (query?.callerId) {
            jEvent.ownerId = query.callerId as string;
        }

        if (settings.resourceIdFromId && query?.[ENTITY_FIELDS._id]) {
            jEvent.resourceId = query[ENTITY_FIELDS._id];
        }

        if (error) {
            jEvent.status = JournalizedEventStatus.failure;
            jEvent.level = JournalizedEventLevel.medium;
            jEvent.data = { query: JSON.stringify(query) };
        } else {
            jEvent.status = JournalizedEventStatus.success;
            jEvent.level = JournalizedEventLevel.info;
        }
        if (jData) {
            jEvent.data = jEvent.data || {};
            jEvent.data.result = jData;
        }

        return jEvent;
    };
}
