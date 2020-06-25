import { MongoDB } from './../types';
import { Option } from './option';
import { Options } from "./options"
import { CoerceOptions } from './coerce_options';
import { CoerceURI } from './coerce_uri';
import * as url from 'url'
import * as querystring from 'querystring'
import {
  Compressor,
  AuthMechanismProperties,
  ReadConcernLevel,
  AuthMechanism,
} from "./types"
import { writeConcern } from '../write_concern';
import { readPreference } from '../read_preference';

export type ClientOptionsInput = Partial<Options> & { [s: string]: any }
export type CB = (err, v: ClientOptions) => any

export class ClientOptions extends Options {
  // ----- Overwrite types from MongoOptions for internal typing ------

  authMechanismProperty: AuthMechanismProperties
  writeConcern: MongoDB.Command.WriteConcern
  readPreference: MongoDB.Command.ReadPreference

  // ----- Internal alias variables not allowed in URI or Options -----

  /** Do not use ".compression" use array ".compressors" */
  get compression() {
    // this is an example of an internal deprecation
    throw new Error('internally use compressors');
    return undefined;
  }


  // get writeConcern () {
  //   return WriteConcern.create({
  //     j: this.j,
  //     w: this.w,
  //     wtimeout: this.wtimeout
  //   })
  // }

  /**
   * This handler loops over every key in URI query as well as
   * every option in the options object.
   */
  assignConnectionUrl (queryOptions: any) {
    const coerceURI = new CoerceURI()
    Object.keys(queryOptions).forEach(authoredKey => {
      const value = queryOptions[authoredKey]
      const option = new Option({ lib: coerceURI, authoredKey, value })
      this.uriOptions(option)
    })

  }

  assignOptions (options: any) {
    const coerceOptions = new CoerceOptions()
    Object.keys(options).forEach(authoredKey => {
      const value = options[authoredKey]
      const option = new Option({ lib: coerceOptions, authoredKey, value })
      this.uriOptions(option)
      this.driverOptions(option)
    })
  }

  uriOptions (option: Option) {
    // OFFICIAL URI Options
    option.match('replicaSet').toString().assign(this)
    option.match('ssl').favor('tls').toBoolean().assign(this, 'tls')
    option.match('tls').toBoolean().assign(this)
    option.match('tlsCertificateKeyFile').toString().assign(this)
    option.match('tlsCertificateKeyFilePassword').toString().assign(this)
    option.match('tlsCAFile').toString().assign(this)
    option.match('tlsAllowInvalidCertificates').toBoolean().assign(this)
    option.match('tlsAllowInvalidHostnames').toBoolean().assign(this)
    option.match('tlsInsecure').toBoolean().assign(this)
    option.match('connectTimeoutMS').toNumber().assign(this)
    option.match('socketTimeoutMS').toNumber().assign(this)
    option.match('compressors').toArrayOfEnum({ Compressor }).concat(this)
    option.match('zlibCompressionLevel').toNumber().assign(this)
    option.match('minPoolSize').toNumber().assign(this)
    option.match('maxPoolSize').toNumber().assign(this)
    option.match('maxIdleTimeMS').toNumber().assign(this)
    option.match('waitQueueMultiple').toNumber().assign(this)
    option.match('waitQueueTimeoutMS').toNumber().assign(this)
    option.match('w').toWriteConcern().assign(this)
    option.match('wtimeoutMS').toNumber().assign(this)
    option.match('journal').toBoolean().assign(this)
    option.match('readConcernLevel').toEnum({ ReadConcernLevel }).assign(this)
    option.match('readPreference').assign(this)
    option.match('maxStalenessSeconds').toNumber().assign(this)
    option.match('authSource').toString().assign(this)
    option.match('authMechanism').toEnum({ AuthMechanism }).assign(this)
    option.match('authMechanismProperties').toAuthMechanismProperties().objectAssign(this)
    option.match('gssapiServiceName').toString().assign(this)
    option.match('localThresholdMS').toNumber().assign(this)
    option.match('serverSelectionTimeoutMS').toNumber().assign(this)
    option.match('serverSelectionTryOnce').toBoolean().assign(this)
    option.match('heartbeatFrequencyMS').toNumber().assign(this)
    option.match('appName').toString().assign(this)
    option.match('retryWrites').toBoolean().assign(this)
    option.match('uuidRepresentation').notSupported()
    option.match('directConnection').toBoolean().assign(this)
    option.uriNoMatch() // if it's not been matched it shouldn't be in the URI
  }

  driverOptions (option: Option) {
    option.match('j').toBoolean().assign(this, 'journal')
    option.match('autoReconnect').toBoolean().assign(this, 'auto_reconnect')
    option.match('poolSize').toNumber().assign(this, 'maxPoolSize')
    // Custom Driver options
    option.match('auto_reconnect').toBoolean().assign(this)
    option.match('compression').toEnum({ Compressor }).push(this, 'compressors')
    option.match('poolSize').favor('maxPoolSize').toNumber().assign(this, 'maxPoolSize')
    option.match('appname').favor('appName').toString().assign(this, 'appName')
    option.match('readConcern').toReadConcern().use(v => {
      if (v.level) this.readConcernLevel = v.level
    })
    option.match('auth').toAuth().assign(this)
    // TODO: add .favor for tls option
    option.match('sslValidate').toBoolean().assign(this)
    option.match('sslCA').toBuffer().assign(this)
    option.match('sslCert').toBuffer().assign(this)
    option.match('sslKey').toBuffer().assign(this)
    option.match('sslPass').toBuffer().assign(this)
    option.match('sslCRL').toBuffer().assign(this)
    option.match('checkServerIdentity').toFunction().assign(this)
    option.match('noDelay').toBoolean().assign(this)
    option.match('keepAlive').toBoolean().assign(this)
    option.match('keepAliveInitialDelay').toNumber().assign(this)
    option.match('family').toFamily().assign(this)
    option.match('reconnectTries').toNumber().assign(this)
    option.match('reconnectInterval').toNumber().assign(this)
    option.match('ha').toBoolean().assign(this)
    option.match('haInterval').toNumber().assign(this)
    option.match('secondaryAcceptableLatencyMS').toNumber().assign(this)
    option.match('acceptableLatencyMS').toNumber().assign(this)
    option.match('connectWithNoPrimary').toBoolean().assign(this)
    option.match('wtimeout').toNumber().assign(this)
    option.match('forceServerObjectId').toBoolean().assign(this)
    option.match('serializeFunctions').toBoolean().assign(this)
    option.match('ignoreUndefined').toBoolean().assign(this)
    option.match('raw').toBoolean().assign(this)
    option.match('bufferMaxEntries').toNumber().assign(this)
    option.match('pkFactory').toPkFactory().assign(this)
    option.match('promiseLibrary').toPromiseLibrary().assign(this)
    option.match('loggerLevel').assign(this)
    option.match('logger').assign(this)
    option.match('promoteValues').toBoolean().assign(this)
    option.match('promoteBuffers').toBoolean().assign(this)
    option.match('promoteLongs').toBoolean().assign(this)
    option.match('domainsEnabled').toBoolean().assign(this)
    option.match('validateOptions').toBoolean().assign(this)
    option.match('fsync').toBoolean().assign(this)
    option.match('numberOfRetries').toNumber().assign(this)
    option.match('monitorCommands').toBoolean().assign(this)
    option.match('minSize').toNumber().assign(this)
    option.match('useNewUrlParser').toBoolean().assign(this)
    option.match('useUnifiedTopology').toBoolean().assign(this)
    option.match('writeConcern').assign(this)
    option.optionsNoMatch() // if it's not been matched it shouldn't be in options
  }

  constructor (
    connectionString?: string | ClientOptionsInput | CB,
    options: ClientOptionsInput | CB = {},
    callback?: CB
  ) {
    super()
    const cs = connectionString

    const $connectionString = (() => {
      if (typeof cs === 'string') return cs
      return ''
    })()

    const $options = (() => {
      if (typeof cs !== 'string' && typeof cs !== 'function') return cs
      if (typeof options !== 'function') return options
      return {}
    })()

    const $callback = (() => {
      if (typeof cs === 'function') return cs
      if (typeof options === 'function') return options
      return callback
    })()

    if ($connectionString) {
      const parsedUrl = url.parse($connectionString)
      // Ideally here, add the existing URI parser to add things like hosts and
      // protocol, username, and password from the string database to the options,
      // I left this of this demo, but it would be here the values of which would
      // be attached to 'this'. Up for debate whether or not we make it available
      // to the user to add properties like 'host(s)' in from the options. That
      // functionality is not hard to add in.
      const queryOptions = parsedUrl.query ? querystring.parse(parsedUrl.query) : {}
      this.assignConnectionUrl(queryOptions)
    }

    if ($options) {
      this.assignOptions($options)
    }

    // Now that the options values are "finalized" we can apply checks and
    // change state if we have to. Below would be a list of functions that
    // mutate the state of this object.
    this.afterParse()

    // Here we include any async operations, unlike our current options parser /
    // validator,this allows use to keep this function sync by omitting the
    // callback. The this.freeze method was added to ensure that in the callback
    // case objects aren't being frozen then updated by the async operations.

    if ($callback) {
      // example async stuff
      this.resolveTLSFiles((err) => {
        if (err) throw err
        this.DNSCheck((err) => {
          if (err) throw err
          this.freeze()
          return $callback(err, this)
        })
      })
    } else {
      this.freeze()
    }
  }

  freeze () {
    Object.freeze(this)
    Object.freeze(this.auth)
    Object.freeze(this.authMechanismProperties)
    Object.freeze(this.compressors)
    Object.freeze(this.readPreference)
    // Object.freeze(this.writeConcern)
  }

  afterParse () {
    this.aliases()
    this.resolveReadPreference()
    this.translateTLS()
    this.validateAuth()
  }

  aliases () {
    if (typeof this.tls !== 'undefined') this.ssl = this.tls
    if (typeof this.journal !== 'undefined') this.j = this.journal
    if (typeof this.maxPoolSize !== 'undefined') this.poolSize = this.maxPoolSize
    if (typeof this.appName !== 'undefined') this.appname = this.appName
    if (typeof this.auto_reconnect !== 'undefined') this.autoReconnect = this.auto_reconnect
    this.writeConcern = writeConcern(this)
    this.readPreference = readPreference(this)
  }

  /** returns export of all options without artificial aliases, which cause
   * warnings on circular use.  */
  get export () {
    const value = {...this}
    delete value.ssl
    delete value.j
    delete value.poolSize
    delete value.appName
    delete value.autoReconnect
    return value
  }

  translateTLS () {
    if (this.tlsInsecure) {
      this.checkServerIdentity = () => {}
      this.sslValidate = false
    } else {
      this.sslValidate = this.tlsAllowInvalidCertificates
    }
  }

  validateAuth () {
    // do stuff to validate user / password and authMech
  }

  resolveReadPreference () {
    // ensure this.readPreference is an instance of ReadPreference and not a mode string
  }

  resolveTLSFiles (cb) {
    return cb(null)
  }

  DNSCheck (cb) {
    return cb(null)
  }

  static parse (...args: ConstructorParameters<typeof ClientOptions>) {
    return new ClientOptions(...args)
  }

  clone (options: ClientOptionsInput = {}) {
    return ClientOptions.parse({ ...this.export, ...options })
  }

}
