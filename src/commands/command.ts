import { Server } from "../server"

// interface BSONOptions {
//   serializeFunctions: false,
//   checkKeys: false
// }

export abstract class Command <G, T> {
  abstract retryable: boolean
  abstract write: boolean
  abstract read: boolean
  abstract command (server: Server): T
  options: G
  constructor (options: G) {
    this.options = options
  }
}