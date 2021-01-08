import { JournalizedSourceType } from './journalized-source-type';

export interface JournalizerSettings {
    operation?: string;
    source?: string;
    sourceType?: JournalizedSourceType;
    resourceIdFromId?: boolean;
}
