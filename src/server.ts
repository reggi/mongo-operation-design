import { MongoDB } from "./types";

export class Server {
  wireVersion: MongoDB.WireVersions
  constructor (wireVersion: MongoDB.WireVersions) {
    this.wireVersion = wireVersion
  }
}
