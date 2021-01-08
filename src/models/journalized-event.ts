import { Entity, ENTITY_FIELDS } from '@sppapps-entity-shared';
import { JournalizedEventLevel } from './journalized-event-level';
import { JournalizedEventStatus } from './journalized-event-status';
import { JournalizedSourceType } from './journalized-source-type';

export interface JournalizedEvent extends Entity {

    ip?: string;
    source?: string;
    sourceType?: JournalizedSourceType;
    target?: string;
    operation?: string;
    status?: JournalizedEventStatus;
    resourceId?: string;
    principalId?: string;
    principalEMail?: string;
    level?: JournalizedEventLevel;
    data?: any;
}

export const JOURNALIZED_EVENT_FIELDS = {
    ...ENTITY_FIELDS,
    ip: 'ip',
    source: 'source',
    sourceType: 'sourceType',
    target: 'target',
    operation: 'operation',
    resourceId: 'resourceId',
    principalId: 'principalId',
    principalEMail: 'principalEMail',
    level: 'level',
    data: 'data'
};
