import { ClientOptions } from './client_options/client_options';
import { Collection } from './collection';
import { ClientOptionsInput } from './client_options';
import { Client } from './client'

export class Db {
  name: string
  client: Client
  options: ClientOptions
  constructor (opt: {
    options?: ClientOptionsInput
    name: string,
    client: Client
  }) {
    this.name = opt.name
    this.client = opt.client
    this.options = this.client.options.clone(opt.options)
  }

  collection (name: string, options: ClientOptionsInput = {}) {
    return new Collection({ name, options, db: this })
  }
}