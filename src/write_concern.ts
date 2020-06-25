import { Options } from './client_options/options';
import { MongoDB } from './types';

export type WriteConcernViable =
  MongoDB.Command.WriteConcern &
  { journal?: Options['j']} &
  { writeConcern?: WriteConcernViable }

export function writeConcern (viable?: WriteConcernViable): MongoDB.Command.WriteConcern {
  if (viable && typeof viable['writeConcern'] !== 'undefined') {
    return writeConcern(viable['writeConcern'])
  }
  if (typeof viable === 'undefined') return undefined

  const w = (() => {
    if (typeof viable.w === 'number') return viable.w
    if (viable && viable.w && viable.w.match(/majority/i)) return 'majority'
    return undefined
  })()

  const wtimeout = (() => {
    if (typeof viable.wtimeout === 'number') return viable.wtimeout
    return undefined
  })()

  const j = (() => {
    if (typeof viable.j === 'boolean') return viable.j
    if (typeof viable.journal === 'boolean') return viable.journal
    return undefined
  })()

  const hasValue = Boolean(w || j || wtimeout)

  if (!hasValue) return undefined

  const value = {
    ...(w ? { w } : {}),
    ...(j ? { j } : {}),
    ...(wtimeout ? { wtimeout } : {})
  }
  Object.freeze(value)
  return value
}
