export enum AuthMechanism {
  'GSSAPI' = 'GSSAPI',
  'MONGODB-AWS' = 'MONGODB-AWS',
  'MONGODB-X509' = 'MONGODB-X509',
  'MONGODB-CR' = 'MONGODB-CR',
  'DEFAULT' = 'DEFAULT',
  'SCRAM-SHA-1' = 'SCRAM-SHA-1',
  'SCRAM-SHA-256' = 'SCRAM-SHA-256',
  'PLAIN' = 'PLAIN'
}

export enum UserRequiredAuthMechanism {
  'GSSAPI' = AuthMechanism['GSSAPI'],
  'MONGODB-CR' = AuthMechanism['MONGODB-CR'],
  'PLAIN' = AuthMechanism['PLAIN'],
  'SCRAM-SHA-1' = AuthMechanism['SCRAM-SHA-1'],
  'SCRAM-SHA-256' = AuthMechanism['SCRAM-SHA-256']
}

export enum Compressor {
  snappy = 'snappy',
  zlib = 'zlib',
  zstd = 'zstd'
}

export enum ReadConcernLevel {
  local = 'local',
  majority = 'majority',
  linearizable = 'linearizable',
  available = 'available'
};

export enum UuidRepresentation {
  standard = "standard",
  csharpLegacy = "csharpLegacy",
  javaLegacy = "javaLegacy",
  pythonLegacy = "pythonLegacy"
};

export interface AuthMechanismProperties {
  SERVICE_NAME: string | undefined
  CANONICALIZE_HOST_NAME: boolean | undefined
  SERVICE_REALM: string | undefined
}

export interface ReadConcern {
  level: keyof typeof ReadConcernLevel | typeof ReadConcernLevel | undefined
}

export class ReadPreference {}

export const MAJORITY = 'majority'
export type WriteConcern = number | typeof MAJORITY

export interface Auth {
  user: string | undefined
  pass: string | undefined
}

export abstract class PkFactoryAbstract {
  abstract createPk(): any
}

export interface PkFactoryLiteral {
  createPk(): any
}

export type PkFactory = typeof PkFactoryAbstract | PkFactoryLiteral

export abstract class PromiseLibraryAbstract {
  constructor(executor: (
    resolve: (value?: any) => void,
    reject: (reason?: any) => void) => void) {}
  abstract then(...args: any[]): any
}

export type PromiseLibrary = typeof PromiseLibraryAbstract
