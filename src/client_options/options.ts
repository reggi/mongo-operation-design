import { ReadPreferenceViable } from './../read_preference';
import { WriteConcernViable } from './../write_concern';
import {
  Compressor,
  ReadConcernLevel,
  AuthMechanism,
  AuthMechanismProperties,
  ReadConcern,
  Auth
} from './types';

export class Options {
  // URI Server Properties
  replicaSet?: string
  tls: boolean = false
  ssl: Options['tls'] // don't assign default value for values for aliases, or will-be getters internally
  tlsCertificateKeyFile?: string
  tlsCertificateKeyFilePassword?: string
  tlsCAFile?: string
  tlsAllowInvalidCertificates: boolean = false
  tlsAllowInvalidHostnames: boolean = false
  tlsInsecure: boolean = false
  connectTimeoutMS: number = 10000
  socketTimeoutMS: number = 360000
  compressors: (keyof typeof Compressor)[] = []
  zlibCompressionLevel: number = 0
  // maxPoolSize: number = 100 // server default
  maxPoolSize: number = 5 // driver default
  minPoolSize: number = 0
  maxIdleTimeMS?: number
  waitQueueMultiple?: number
  waitQueueTimeoutMS?: number
  w: number | 'majority' = 1
  wtimeoutMS?: number
  journal?: boolean
  j: Options['journal'] // don't assign default value for values for aliases, or will-be getters internally
  readConcernLevel: keyof typeof ReadConcernLevel = ReadConcernLevel.local
  readPreference?: ReadPreferenceViable
  maxStalenessSeconds?:  number
  // readPreferenceTags: def.tags(),
  authSource?: string
  authMechanism: AuthMechanism = AuthMechanism.DEFAULT
  authMechanismProperties: Partial<AuthMechanismProperties> = {
    SERVICE_NAME: undefined,
    CANONICALIZE_HOST_NAME: false,
    SERVICE_REALM: undefined
  }
  gssapiServiceName?: string
  localThresholdMS?: number
  serverSelectionTimeoutMS?: number
  serverSelectionTryOnce: boolean = true
  heartbeatFrequencyMS?: number
  appName?: string
  retryWrites: boolean = true
  uuidRepresentation?: ReadConcernLevel
  directConnection: boolean = true

  // Driver Specific
  poolSize: Options['maxPoolSize'] // don't assign default value for values for aliases, or will-be getters internally
  sslValidate: boolean = false
  sslCA?: Buffer
  sslCert?: Buffer
  sslKey?: Buffer
  sslPass?: Buffer
  sslCRL?: Buffer
  checkServerIdentity: Function = () => {}
  autoReconnect: boolean = true
  auto_reconnect: Options['autoReconnect']  // don't assign default value for values for aliases, or will-be getters internally
  noDelay: boolean = true
  keepAlive: boolean = true
  keepAliveInitialDelay: number = 30000
  family: 4 | 6 | null = null
  reconnectTries: number = 30
  reconnectInterval: number = 1000
  /** Control if high availability monitoring runs for Replicaset or Mongos proxies */
  ha: boolean = true
  /** The High availability period for replicaset inquiry */
  haInterval: number = 10000
  secondaryAcceptableLatencyMS: number = 15
  acceptableLatencyMS: number = 15
  connectWithNoPrimary: boolean = false
  wtimeout?: number
  forceServerObjectId: boolean = false
  serializeFunctions: boolean = false
  ignoreUndefined: boolean = false
  raw: boolean = false
  bufferMaxEntries: number = -1
  /** A primary key factory object for generation of custom _id keys */
  pkFactory?: object
  promiseLibrary?: Function
  readConcern: Partial<ReadConcern> // don't assign default value for values for aliases, or will-be getters internally
  loggerLevel: 'error' | 'warn' | 'info' | 'debug' = 'error'
  logger?: object
  promoteValues: boolean = true
  promoteBuffers: boolean = false
  promoteLongs: boolean = true
  domainsEnabled: boolean = false
  validateOptions: boolean = false
  appname: Options['appName'] // don't assign default value for values for aliases, or will-be getters internally
  auth: Partial<Auth> = {
    user: undefined,
    pass: undefined
  }
  fsync: boolean = false
  numberOfRetries: number = 5
  monitorCommands: boolean = false
  minSize?: number
  useNewUrlParser: boolean = true
  useUnifiedTopology: boolean = false
  compression?: keyof typeof Compressor // don't assign default value for values for aliases, or will-be getters internally
  // TODO: custom types:
  // autoEncryption: {}
  // driverInfo
  writeConcern?: WriteConcernViable
}
