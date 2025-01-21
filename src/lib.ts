import { getDefinitions } from './schemaParser/def'
import { isSupportedSchemaVersion, ParsingSchema, RootSchema } from './schemaParser'
import { SchemaForm, SchemaInstance } from './jsonForm'
import { parseProperties } from './schemaParser/properties'
import { InternalConfig, ParsingConfig } from './config'
import { IfCondition, parseIfCondition } from './schemaParser/condition'
import { UnsupportedSchemaError } from './errors'
import { EnumPatternTypes, isAnyOfEnumPattern } from './schemaParser/enums'
import { enumInputAdjacentTagged } from './inputTypes/EnumInput2'
/**
 * Parses a stringified JSON schema into a form
 * @param schema schema to be parsed into a form
 * @returns  Form instance
 */
export function parseJsonSchema(schema: string, config?: ParsingConfig): SchemaForm {
  const rawForm: RootSchema = JSON.parse(schema)
  return createForm(rawForm, config)
}
export function createForm(schema: RootSchema, config?: ParsingConfig): SchemaForm {
  const actualConfig = new InternalConfig(config)
  if (!isSupportedSchemaVersion(schema)) {
    if (actualConfig.denyOnUnknownSchema) {
      throw new UnsupportedSchemaError(schema.$schema)
    } else {
      console.warn(`${schema.$schema} is not supported. This could lead to unexpected results`)
    }
  }

  const parsingSchema = new ParsingSchema(getDefinitions(schema), schema, actualConfig)
  const primaryInstance = new SchemaInstance()
  if (parsingSchema.schema.if) {
    primaryInstance.condition = parseIfCondition(parsingSchema.schema as IfCondition, parsingSchema)
  }
  primaryInstance.required = schema.required ?? []
  if (parsingSchema.schema.properties) {
    primaryInstance.properties = parseProperties(parsingSchema)
  }
  const result = new SchemaForm(schema.$schema, schema.title ?? 'Form', primaryInstance)
  const allOf = Array<SchemaInstance>()
  for (const allOfRaw of schema.allOf ?? []) {
    const allOfInstance = new SchemaInstance()
    if (allOfRaw.if) {
      allOfInstance.condition = parseIfCondition(allOfRaw as IfCondition, parsingSchema)
    }
    if (allOfRaw.properties) {
      allOfInstance.properties = parseProperties(parsingSchema)
    }
    allOfInstance.required = allOfRaw.required ?? []
    allOf.push(allOfInstance)
  }
  result.allOf = allOf

  if (schema.oneOf) {
    const anyOfEnum = isAnyOfEnumPattern(schema.oneOf)
    if (anyOfEnum) {
      console.debug(`[DEBUG] Found Enum Pattern ${JSON.stringify(anyOfEnum)}`)

      if (anyOfEnum.type === EnumPatternTypes.InternallyTagged) {
        throw new Error('Internally Tagged Enum Patterns are not supported yet')
      } else if (anyOfEnum.type === EnumPatternTypes.AdjacentlyTagged) {
        const enumInput = enumInputAdjacentTagged(
          anyOfEnum.keyTag,
          anyOfEnum.valueTag,
          schema.oneOf,
          parsingSchema
        )
        if (enumInput) {
          if (result.primary.properties === undefined) {
            result.primary.properties = []
          }
          result.primary.properties.push(enumInput)
        }
      }
    } else {
      console.debug(`[DEBUG] No Enum Pattern Found`)
    }
  }

  return result
}

export * from './jsonForm'
export * from './config'
export * from './inputTypes'
export * from './schemaParser'
export * from './errors'
export * from './utils'
