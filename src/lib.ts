import { getDefinitions } from './schemaParser/def'
import { ParsingSchema, RootSchema } from './schemaParser/schema'
import { SchemaForm, SchemaInstance } from './jsonForm'
import { parseProperties } from './schemaParser/properties'
import { IfCondition, parseIfCondition } from './schemaParser/condition'
export function parseJsonSchema(schema: string): SchemaForm {
  const rawForm: RootSchema = JSON.parse(schema)
  return createForm(rawForm)
}
export function createForm(schema: RootSchema): SchemaForm {
  const parsingSchema = new ParsingSchema(getDefinitions(schema), schema)
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

  return result
}

export * from './jsonForm'
export * from './inputTypes/NumberInput'
export * from './inputTypes/DefaultInput'
export * from './inputTypes/BooleanInput'
export * from './inputTypes/ArrayInput'
export * from './inputTypes/ObjectInput'
export * from './inputTypes/StringInput'
export * from './inputTypes/EnumInput'
export * from './schemaParser/def'
export * from './schemaParser/schema'
export * from './schemaParser/properties'
export * from './schemaParser/condition'
