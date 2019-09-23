import { v4 } from 'uuid';

export class StreamEvent {
  public id: string = v4();
  public value: any;

  constructor({ id, value }: Partial<StreamEvent> = {}) {
    if (id != null) {
      this.id = id;
    }
    this.value = value;
  }
}
