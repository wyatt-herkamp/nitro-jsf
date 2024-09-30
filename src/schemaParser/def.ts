import { Property } from './properties'
import { BaseSchema } from '.'
import { isHttpDefinition } from '../utils'
export type Definition = BaseSchema | Property
export class Definitions {
  definitions: Record<string, Definition>
  constructor(definitions: Record<string, Definition>) {
    this.definitions = definitions
  }
  lookupDefinition(ref: string): Definition {
    if (isHttpDefinition(ref)) {
      throw new Error(
        `HTTP References must be looked up via a call to ParsingSchema.lookupDefinition`
      )
    }
    const definition = this.definitions[ref]
    if (!definition) {
      throw new Error(`Definition ${ref} not found`)
    }
    return definition
  }
}
// TODO: Not all references start with #/ I think?
export function getDefinitions(schema: BaseSchema): Definitions {
  const definitions = {} as Record<string, Definition>
  const newDefinitions = schema[`$defs`]
  if (newDefinitions) {
    for (const key in newDefinitions) {
      if (Object.prototype.hasOwnProperty.call(newDefinitions, key)) {
        const element = newDefinitions[key]
        definitions[`#/$defs/${key}`] = element
      }
    }
  }
  const oldDefinitions = schema['definitions']
  if (oldDefinitions) {
    const keys = Object.keys(oldDefinitions)
    for (let i = 0; i < keys.length; i++) {
      definitions[`#/definitions/${keys[i]}`] = oldDefinitions[keys[i]]
    }
  }
  return new Definitions(definitions)
}
