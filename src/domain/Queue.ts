import { v4 } from 'uuid';

export default class Queue<T> {
  public readonly id: string = v4();
  private nativeArray: T[];

  constructor(...args: T[]) {
    this.nativeArray = args;
  }

  public push(...args: Parameters<T[]['push']>) {
    return this.nativeArray.push(...args);
  }

  public pop(...args: Parameters<T[]['pop']>) {
    return this.nativeArray.pop(...args);
  }

  public shift(...args: Parameters<T[]['shift']>) {
    return this.nativeArray.shift(...args);
  }

  public unshift(...args: Parameters<T[]['unshift']>) {
    return this.nativeArray.unshift(...args);
  }
}
