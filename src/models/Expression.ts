import { UuidGeneratable } from './UuidGeneratable'

export class Expression extends UuidGeneratable {
  value: string

  constructor(value: string) {
    super()
    this.value = value
  }
}
