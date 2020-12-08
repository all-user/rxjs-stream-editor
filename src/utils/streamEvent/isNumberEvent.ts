import { StreamEvent } from '../../core/StreamEvent';

export const isNumberEvent = (event: StreamEvent) =>
  event.value != null && event.value.__proto__ === Number.prototype;
