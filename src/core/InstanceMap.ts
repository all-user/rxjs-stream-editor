import omit from 'lodash-es/omit';

export interface InstanceMap<T> {
  all: T[];
  get(id: string): T | null;
  set(id: string, value: T): T;
  delete(id: string): void;
}

export const defineInstanceMap = <T>(idName: keyof T) => {
  return class implements InstanceMap<T> {
    private native: { [id: string]: T };

    constructor(...values: T[]) {
      const obj = values.reduce<{ [id: string]: T }>((acc, v) => {
        const id = v[idName];
        if (typeof id !== 'string') {
          throw new Error(`Instance property "${idName}" is not typeof string`);
        }
        acc[id] = v;
        return acc;
      }, {});
      this.native = obj;
    }

    public get(id: string) {
      return this.native[id] || null;
    }

    public set(id: string, value: T) {
      this.native = {
        ...this.native,
        [id]: value,
      };
      return value;
    }

    public delete(id: string) {
      this.native = omit(this.native, [id]);
    }

    get all() {
      return Object.keys(this.native)
        .map(k => this.native[k])
        .filter(v => v);
    }
  };
};
