import { StreamEvent } from '../../core/StreamEvent';

export const isStringEvent = (event: StreamEvent) =>
  event.value != null && event.value.__proto__ === String.prototype;
