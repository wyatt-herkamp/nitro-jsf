import { Property } from './properties'
import { BaseSchema } from './schema'
export type Definition = BaseSchema | Property
export class Definitions {
  definitions: Record<string, Definition>
  constructor(definitions: Record<string, Definition>) {
    this.definitions = definitions
  }
  lookupDefinition(ref: string): Definition {
    if (ref.startsWith('http') || ref.startsWith('https')) {
      throw new Error(`HTTP references are not supported`)
    }
    let definition = this.definitions[ref]
    if (!definition) {
      throw new Error(`Definition ${ref} not found`)
    }

    return definition
  }
}
// TODO: Not all references start with #/ I think?

export function getDefinitions(schema: BaseSchema): Definitions {
  let definitions = {} as Record<string, Definition>
  let newDefinitions = schema[`$defs`]
  if (newDefinitions) {
    for (const key in newDefinitions) {
      if (Object.prototype.hasOwnProperty.call(newDefinitions, key)) {
        const element = newDefinitions[key]
        definitions[`#/$defs/${key}`] = element
      }
    }
  }
  let oldDefinitions = schema['definitions']
  if (oldDefinitions) {
    let keys = Object.keys(oldDefinitions)
    for (let i = 0; i < keys.length; i++) {
      definitions[`#/definitions/${keys[i]}`] = oldDefinitions[keys[i]]
    }
  }
  return new Definitions(definitions)
}
