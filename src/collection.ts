import { FindAndModifyCommand } from './commands/find_and_modify';
import { Db } from './db'
import { ClientOptions, ClientOptionsInput } from './client_options'
import { MongoDB } from "./types"
import { maybePromise } from './utility/maybe_promise'
import { Server } from './server';

type Query = Exclude<MongoDB.Command.FindAndModify['query'], undefined>
type Sort = Exclude<MongoDB.Command.FindAndModify['sort'], undefined>
type Document = Exclude<MongoDB.Command.FindAndModify['update'], undefined>
type Options = MongoDB.CommandUserOption.FindAndModify
type Cb = MongoDB.Return.Document.Callback
type P = MongoDB.Return.Document.Promise
type OrCB<T> = T | Cb

export class Collection {
  options: ClientOptions
  db: Db
  name: string
  constructor (opt: {
    options?: ClientOptionsInput
    db: Db
    name: string
  }) {
    this.name = opt.name
    this.db = opt.db
    this.options = this.db.options.clone(opt.options)
  }

  findAndModify (): P
  findAndModify (callback: Cb): undefined
  findAndModify (query: Query): P
  findAndModify (query: Query, callback: Cb): undefined
  findAndModify (query: Query, sort: Sort): P
  findAndModify (query: Query, sort: Sort, callback: Cb): undefined
  findAndModify (query: Query, sort: Sort, document: Document): P
  findAndModify (query: Query, sort: Sort, document: Document, callback: Cb): undefined
  findAndModify (query: Query, sort: Sort, document: Document, options: Options): P
  findAndModify (query: Query, sort: Sort, document: Document, options: Options, callback: Cb): undefined
  findAndModify (
    query?: OrCB<Query>,
    sort?: OrCB<Sort>,
    document?: OrCB<Document>,
    options?: OrCB<Options>,
    callback?: Cb
  ): P | undefined {

    const _query = () => {
      if (typeof query === 'function') return {}
      return query
    }

    const _sort = () => {
      if (typeof sort === 'function') return []
      return query
    }

    const _update = () => {
      if (typeof document === 'function') return {}
      if (typeof document === 'undefined') return {}
      return document
    }

    const _callback = () => {
      if (typeof callback === 'function') return callback
      if (typeof options === 'function') return options
      if (typeof document === 'function') return document
      if (typeof sort === 'function') return sort
      if (typeof query === 'function') return query
      return undefined
    }

    const command = new FindAndModifyCommand({
      findAndModify: this.name,
      $db: this.db.name,
      $readPreference: this.options.readPreference,
      ...(this.options.writeConcern ? {writeConcern: this.options.writeConcern} : {}),
      query: _query(),
      sort: _sort(),
      update: _update()
    })

    return maybePromise(_callback(), (wrap) => {
      const server = new Server(8);
      return wrap(null, command.command(server))
    })
  }
}
