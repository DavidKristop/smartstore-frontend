import { EventEmitter } from 'events';

class GlobalEventBus extends EventEmitter {}

const eventBus = new GlobalEventBus();

export const EVENTS = {
    FILE_CREATED: 'FILE_CREATED',
    FILE_DELETED: 'FILE_DELETED',
    FILE_RENAMED: 'FILE_RENAMED',
};

export default eventBus;