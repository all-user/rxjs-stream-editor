import { v4 } from 'uuid';
import { StreamEvent } from './StreamEvent';
import { InstanceMap, defineInstanceMap } from '../lib/InstanceMap';

const StreamEventInstanceMap = defineInstanceMap<StreamEvent>('id');

export class StreamDataset {
  public id: string = v4();
  public eventMap: InstanceMap<StreamEvent>;
  public eventIds: string[];
  public sourceCode: string;

  constructor({
    id,
    eventMap,
    eventIds,
    sourceCode,
  }: Partial<StreamDataset> = {}) {
    if (id != null) {
      this.id = id;
    }
    this.eventMap = eventMap || new StreamEventInstanceMap();
    this.eventIds = eventIds || [];
    this.sourceCode = sourceCode || '';
  }

  public pushEvents(...args: Parameters<StreamEvent[]['push']>) {
    const ids: string[] = [];
    args.forEach(e => {
      this.eventMap.set(e.id, e);
      ids.push(e.id);
    });
    this.eventIds.push(...ids);
  }

  public shiftEvent() {
    const id = this.eventIds.shift();
    if (id == null || this.eventMap.get(id) == null) {
      return;
    }
    this.eventMap.delete(id);
  }

  public get events() {
    return this.eventIds.map(id => this.eventMap.get(id)!).filter(v => v);
  }
}
