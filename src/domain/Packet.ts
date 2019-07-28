import { v4 } from 'uuid';

export default class Packet {
  public id: string = v4();
  public value: any;

  constructor({ id, value }: Partial<Packet> = {}) {
    if (id != null) {
      this.id = id;
    }
    this.value = value;
  }
}
