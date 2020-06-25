import { MongoDB } from "./types";

export type ReadPreferenceViable = {
    mode?: MongoDB.Command.ReadPreferenceMode | MongoDB.Command.ReadPreferenceModeEnum,
    tags?: any[]
    hint?: boolean
    maxStalenessSeconds?: number
    hedge?: { enabled?: boolean }
    readPreferenceTags?: any[],
    readPreference?: ReadPreferenceViable
    $readPreference?: ReadPreferenceViable
  } |
  MongoDB.Command.ReadPreferenceMode |
  MongoDB.Command.ReadPreferenceModeEnum |
  MongoDB.Command.ReadPreference

export function readPreference (viable?: ReadPreferenceViable) {
  if (viable && typeof viable['readPreference'] !== 'undefined') {
    return readPreference(viable['readPreference'])
  }
  if (viable && typeof viable['$readPreference'] !== 'undefined') {
    return readPreference(viable['$readPreference'])
  }

  const mode = (() => {
    if (typeof viable === 'string') return viable
    if (viable && typeof viable.mode === 'string') return viable.mode
    return undefined
  })()

  const hedge = (() => {
    if (!viable) return undefined
    if (typeof viable === 'string') return undefined
    if (typeof viable.hedge !== 'object') return undefined
    if (!viable.hedge.enabled) return undefined
    return viable.hedge
  })()

  const maxStalenessSeconds = (() => {
    if (typeof viable === 'string') return undefined
    if (viable && typeof viable.maxStalenessSeconds === 'number') return viable.maxStalenessSeconds
    return undefined
  })()

  const tags = (() => {
    if (typeof viable === 'string') return undefined
    if (viable && Array.isArray(viable.tags)) return viable.tags
    if (viable && Array.isArray(viable['readPreferenceTags'])) return viable['readPreferenceTags']
    return undefined
  })()

  // https://github.com/mongodb/specifications/blob/88b162eec61c5117e70eb636c56c5c054d934630/source/server-selection/server-selection.rst#user-content-passing-read-preference-to-mongos:~:text=The%20mode%20field%20MUST%20be%20present%20exactly%20once%20with%20the%20mode%20represented%20in%20camel%20case%3A
  const hasValue = Boolean(hedge || maxStalenessSeconds || tags || mode)

  if (!hasValue) return { mode: MongoDB.Command.ReadPreferenceModeEnum.primary }

  if (!mode) return { mode: MongoDB.Command.ReadPreferenceModeEnum.primary }

  if (mode === MongoDB.Command.ReadPreferenceModeEnum.primary) {
    return { mode }
  }

  return {
    mode,
    ...(tags ? { tags } : {}),
    ...(maxStalenessSeconds ? { maxStalenessSeconds } : {}),
    ...(hedge ? { hedge } : {})
  }
}