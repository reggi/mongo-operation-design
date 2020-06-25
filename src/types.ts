class ClientSession {

}

type NativePromise<T> = Promise<T>

export namespace MongoDB {
  export namespace Command {
    export type Document = { [name: string]: any }

    export type AggregationPipeline = any[]

    export enum ReadPreferenceModeEnum {
      primary = 'primary',
      primaryPreferred = 'primaryPreferred',
      secondary = 'secondary',
      secondaryPreferred = 'secondaryPreferred',
      nearest = 'nearest'
    }

    export type ReadPreferenceMode = keyof typeof ReadPreferenceModeEnum

    export interface ReadPreference {
      mode: ReadPreferenceMode
      hedge?: { enabled: boolean }
      maxStalenessSeconds?: number
      tags?: any[]
    }

    // https://github.com/mongodb/specifications/blob/master/source/read-write-concern/read-write-concern.rst#write-concern
    export interface WriteConcern {
      j?: boolean,
      w?: number | string,
      wtimeout?: number
    }

    export interface LogicalSessionId {
      id: string
    }

    export interface Global {
      $db: string
      $readPreference?: ReadPreference,
    }

    export interface Transaction {
      lsid?: LogicalSessionId
      txnNumber?: number
    }

    export type Write = {
      writeConcern?: WriteConcern
    }

    // https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#:~:text=The%20collation%20option%20has%20the%20following%20syntax%3A
    export interface Collation {
      locale: string,
      caseLevel?: boolean,
      caseFirst?: string,
      strength?: number,
      numericOrdering?: boolean,
      alternate?: string,
      maxVariable?: string,
      backwards?: boolean
    }

    export interface FindAndModifyCore extends Global, Transaction, Write {
      findAndModify: string,
      query?: Document,
      sort?: Document,
      new?: boolean,
      fields?: Document,
      upsert?: boolean,
      bypassDocumentValidation?: boolean,
      collation?: Document,
      arrayFilters?: any[]
    }

    export interface FindAndModifyRemove extends FindAndModifyCore {
      remove: boolean,
      update?: Document | AggregationPipeline
    }

    export interface FindAndModifyUpdate extends FindAndModifyCore {
      remove?: boolean,
      update: Document | AggregationPipeline
    }

    // https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#:~:text=Must%20specify%20either%20the%20remove%20or%20the%20update%20field.%20Performs%20an%20update%20of%20the%20selected%20document.
    export type FindAndModify = FindAndModifyRemove | FindAndModifyUpdate
  }

  export namespace CommandClassOption {
    export type FindAndModify =
      // allow flat write concern properties
      MongoDB.Command.WriteConcern &
      // allow any option in find and modify command
      MongoDB.Command.FindAndModify &
      // custom driver specific options
      { projection?: MongoDB.Command.FindAndModify['fields'], session?: ClientSession }
  }

  export namespace CommandUserOption {
    export type FindAndModify = Omit<CommandClassOption.FindAndModify,
      // do not let users edit $readPreference or $db through options
      keyof MongoDB.Command.Global |
      // do not let users edit transaction through options
      keyof MongoDB.Command.Transaction |
      // do not let users edit collection through options
      'findAndModify' |
      // do not let users query through options
      'query' |
      // do not let users sort through options
      'sort' |
      // do not let users bypassDocumentValidation through options
      'bypassDocumentValidation'>
  }

  // https://github.com/mongodb/specifications/blob/master/source/wireversion-featurelist.rst#:~:text=Server%20Wire%20version%20and%20Feature%20List
  /** maps server version to a wire version */
  export const ServerVersion = {
    '2.6': 2,
    "3.0": 3,
    "3.2": 4,
    "3.4": 5,
    "3.6": 6,
    "4.0": 7,
    "4.2": 8,
  } as const

  export const WireVersion = {
    2: "2.6",
    3: "3.0",
    4: "3.2",
    5: "3.4",
    6: "3.6",
    7: "4.0",
    8: "4.2",
  } as const

  export type ServerVersions = keyof typeof MongoDB.ServerVersion

  export type WireVersions = typeof MongoDB.ServerVersion[ServerVersions]

  export namespace Return {
    export type Callback<T> = (err?: Error | null, result?: T | null) => any | void
    export namespace Document {
      export type Callback = MongoDB.Return.Callback<MongoDB.Command.Document>
      export type Promise = NativePromise<MongoDB.Command.Document>
    }
  }

}