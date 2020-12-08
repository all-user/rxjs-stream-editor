import { StreamEvent } from '../../core/StreamEvent';

export const isNull = (event: StreamEvent) => event.value === null;
