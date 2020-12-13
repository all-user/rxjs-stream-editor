import { StreamEvent } from '../../core/StreamEvent';

export const isUndefined = (event: StreamEvent) => event.value === undefined;
