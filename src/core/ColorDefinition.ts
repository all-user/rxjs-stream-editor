import { v4 } from 'uuid';

export class ColorDefinition {
  public id: string = v4();
  public colorCode: string | null = null;

  constructor({ id, colorCode }: Partial<ColorDefinition> = {}) {
    if (id != null) {
      this.id = id;
    }
    this.colorCode = colorCode ?? null;
  }
}
