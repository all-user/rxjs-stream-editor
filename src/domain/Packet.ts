import { v4 } from 'uuid';

export default class Packet {
  public readonly id: string = v4();

  constructor(
    readonly value: any,
  ) {}
}
