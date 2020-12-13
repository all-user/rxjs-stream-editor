import { StreamEvent } from '../../core/StreamEvent';

export const isBooleanEvent = (event: StreamEvent) =>
  event.value != null && event.value.__proto__ === Boolean.prototype;
