import { StreamEvent } from '../../core/StreamEvent';

export const isArrayEvent = (event: StreamEvent) => Array.isArray(event.value);
