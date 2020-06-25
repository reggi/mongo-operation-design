import { maybePromise } from './utility/maybe_promise'
import { ClientOptions, ClientOptionsInput } from './client_options';
import { Db } from './db'

type CB = (...args: any[]) => any

export class Client {
  options: ClientOptions

  constructor (options: ClientOptions) {
    this.options = options
    return this
  }

  static connect (): Promise<Client>
  static connect (callback: CB): undefined
  static connect (connectionString: string): Promise<Client>
  static connect (connectionString: string, callback: CB): undefined
  static connect (connectionString: string, options: ClientOptionsInput): Promise<Client>
  static connect (connectionString: string, options: ClientOptionsInput, callback: CB): undefined
  static connect (connectionString?: string | CB, options?: ClientOptionsInput | CB, callback?: CB) {
    const $connectionString = (() => {
      if (typeof connectionString === 'string') return connectionString
      return ''
    })()

    const $options = (() => {
      if (typeof options === 'function') return {}
      return options
    })()

    const $callback = (() => {
      if (typeof callback === 'function') return callback
      return undefined
    })()

    return maybePromise($callback, (callback) => {
      ClientOptions.parse($connectionString, $options, (err, options) => {
        if (err) return callback(err)
        const client = new Client(options)
        return callback(null, client)
      })
    })
  }

  db(name: string, options: ClientOptionsInput = {}) {
    return new Db({ name, options, client: this })
  }

}
