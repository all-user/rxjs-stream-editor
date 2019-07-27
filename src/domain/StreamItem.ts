import { v4 } from 'uuid';
import Packet from './Packet';

export default class StreamItem {
  public id: string = v4();
  public sourceCode: string;
  public packets: Packet[];

  constructor({ id, sourceCode, packets }: Partial<StreamItem>) {
    if (id != null) {
      this.id = id;
    }
    this.sourceCode = sourceCode || '';
    this.packets = packets || [];
  }

  public pushPacket(...args: Parameters<Packet[]['push']>) {
    return this.packets.push(...args);
  }

  public shiftPacket() {
    return this.packets.shift();
  }
}
