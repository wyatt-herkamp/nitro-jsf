import { InternalConfig } from '../config'
import { ConditionInput } from './condition'
import { Definition } from './def'
import { Property } from './properties'

export class ParsingSchema {
  definitions: Definition
  schema: BaseSchema
  config: InternalConfig
  constructor(definitions: Definition, schema: BaseSchema, config: InternalConfig) {
    this.definitions = definitions
    this.schema = schema
    this.config = config
  }

  lookupDefinition(ref: string): Definition {
    if (ref.startsWith('http') || ref.startsWith('https')) {
      const result = this.config.fetchSchema(ref)
      if (!result) {
        throw new Error('No Schema Lookup Defined')
      }
      // TODO: Figure out how to handle this
      const resolved = Promise.resolve(result)
      return resolved.then((schema) => {
        if (typeof schema === 'string') {
          return JSON.parse(schema)
        }
      })
    }

    return this.definitions.lookupDefinition(ref)
  }
}
export interface BaseSchema {
  title?: string
  properties?: Record<string, Property>
  required?: Array<string>
  anyOf?: Array<BaseSchema>
  allOf?: Array<BaseSchema>
  oneOf?: Array<BaseSchema>
  not?: ConditionInput
  if?: ConditionInput
  then?: ConditionInput
  else?: ConditionInput
  [key: string]: any
}

export interface RootSchema extends BaseSchema {
  $schema: string
}

export const SUPPORTED_SCHEMA_VERSIONS = ['https://json-schema.org/draft/2020-12/schema']

/// Parses a stringified JSON schema into a form
export function isSupportedSchemaVersion(
  schema:
    | {
        $schema: string
      }
    | string
): boolean {
  if (typeof schema === 'string') {
    return SUPPORTED_SCHEMA_VERSIONS.includes(schema)
  }
  return SUPPORTED_SCHEMA_VERSIONS.includes(schema.$schema)
}
export * from './def'
export * from './properties'
export * from './condition'
