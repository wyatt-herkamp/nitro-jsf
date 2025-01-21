// Checks if the anyOf is a pattern of enums
// We are defining a pattern of enums either as a a bunch of objects following a pattern of
// Some property that is const and has a value then another property with data. Or Adjacent enums
// Or of with its own key with a different value.

import { BaseSchema } from '../lib'
export type EnumPatternType =
  | {
      type: EnumPatternTypes.AdjacentlyTagged
      keyTag: string
      valueTag: string
    }
  | {
      type: EnumPatternTypes.InternallyTagged
    }
export enum EnumPatternTypes {
  AdjacentlyTagged,
  InternallyTagged
}
export function isAnyOfEnumPattern(anyOf: Array<BaseSchema>): EnumPatternType | undefined {
  let patternType = undefined
  for (const schema of anyOf) {
    if (patternType === undefined) {
      const detectedPattern = detectEnumPattern(schema, undefined)
      console.info(`[DEBUG] Detected Enum Pattern ${JSON.stringify(detectedPattern)}`)
      if (detectedPattern === undefined) {
        return undefined
      }
      patternType = detectedPattern
    } else {
      const detectedPattern = detectEnumPattern(schema, patternType)
      if (detectedPattern === undefined) {
        return undefined
      }
    }
  }
  return patternType
}
function detectEnumPattern(
  schema: BaseSchema,
  patternType: EnumPatternType | undefined
): EnumPatternType | undefined {
  if (schema.properties === undefined) {
    return undefined
  }
  const numberOfProperties = Object.keys(schema.properties).length
  if (numberOfProperties === 1) {
    return {
      type: EnumPatternTypes.InternallyTagged
    }
  } else if (numberOfProperties === 2) {
    let keyTag = undefined
    const propertyNames = Object.keys(schema.properties)

    for (const key of propertyNames) {
      if (schema.properties[key].const !== undefined) {
        keyTag = key
        break
      }
    }
    if (keyTag === undefined) {
      return undefined
    }
    let valueTag = undefined
    for (const key of propertyNames) {
      if (key !== keyTag) {
        valueTag = key
        break
      }
    }
    if (valueTag === undefined) {
      return undefined
    }
    console.debug(
      `[DEBUG] Detected Adjacently Tagged Enum Pattern with key: ${keyTag} and value: ${valueTag}`
    )
    if (patternType !== undefined) {
      if (patternType.type !== EnumPatternTypes.AdjacentlyTagged) {
        return undefined
      }
      if (patternType.keyTag !== keyTag || patternType.valueTag !== valueTag) {
        return undefined
      }
    }
    return {
      type: EnumPatternTypes.AdjacentlyTagged,
      keyTag: keyTag,
      valueTag: valueTag
    }
  }

  return undefined
}
