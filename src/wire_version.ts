import { MongoDB } from "./types";

type Compare = MongoDB.ServerVersions | MongoDB.WireVersions

export class WireVersion {
  version: number
  constructor (version: number) {
    this.version = version
  }

  wireVersion (compare: Compare) {
    if (typeof compare === 'string') {
      return MongoDB.ServerVersion[compare]
    }
    return compare
  }

  get serverVersion () {
    return MongoDB.WireVersion[this.version]
  }

  above (compare: Compare) {
    compare = this.wireVersion(compare)
    return compare < this.version
  }
  below (compare: Compare) {
    return compare > this.version
  }
  belowOrEqual (compare: Compare) {
    return compare >= this.version
  }
  aboveOrEqual (compare: Compare) {
    return compare <= this.version
  }
}