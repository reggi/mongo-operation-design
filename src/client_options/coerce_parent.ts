import { WriteConcern, AuthMechanismProperties, Auth } from './types';
import { Warning } from './warning';

/**
 * This is an abstract class that guarantees that additions made
 * to a Coerce lib, should be the same in the other. It can also be used
 * to house methods that both classes can use like incorrectType and validateKeys
 */
export abstract class CoerceParent <T> {
  _silent: boolean = false
  abstract warn(message: string): Warning | void
  abstract boolean(value: T, key: string): boolean | undefined
  abstract string(value: T, key: string): string | undefined
  abstract number(value: T, key: string): number | undefined
  abstract number(value: T, key: string): number | undefined
  abstract enum <E> (e: E, enumName: string): (value: T, key: string) => E | keyof E | undefined
  abstract arrayOfEnum <E>(e: E, enumName: string): (value: T, key: string) => (E | keyof E)[]
  abstract writeConcern(value: T, key: string): WriteConcern | undefined
  abstract authMechanismProperties(value: T, key: string): Partial<AuthMechanismProperties>
  abstract auth(value: T, key: string): Partial<Auth>
  abstract buffer(value: T, key: string): Buffer | undefined
  abstract function(value: T, key: string): Function | undefined
  abstract family(value: T, key: string): 6 | 4 | null

  incorrectType (key: string, value: any, type: string) {
    if (!this._silent) this.warn(`"${key}" with the value of \`${JSON.stringify(value)}\` is not of correct type "${type}"`)
  }

  invalidOption (key: string, value: any, type: string) {
    if (!this._silent) this.warn(`"${key}" with the type of "${type}" is not a valid option`)
  }

  validateKeys (key: string, value: any, type: string, keys: string[]) {
    if (!this._silent) {
      Object.keys(value).forEach((k) => {
        if (!keys.includes(k)) {
          this.warn(`"${key} within the object type "${type}" has an unrecognized property \`${JSON.stringify(k)}\``)
        }
      })
    }
  }

  set silent (value: boolean | undefined) {
    if (typeof value !== 'undefined') {
      this._silent = value
    }
  }
  get silent () {
    return this._silent
  }
}