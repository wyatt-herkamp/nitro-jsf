import { NumberInput } from './inputTypes/NumberInput';
import { DefaultInput } from './inputTypes/DefaultInput';
import { BooleanInput } from './inputTypes/BooleanInput';
import { ArrayInput } from './inputTypes/ArrayInput';
import { ObjectInputType } from './inputTypes/ObjectInput';
import { StringInput } from './inputTypes/StringInput'
import { EnumInput, EnumValidator } from './inputTypes/EnumInput'
import { Definitions, getDefinitions } from './schemaParser/def'
import { ParsingSchema, RootSchema } from './schemaParser/schema'
import { FormConditionalInput, FormInputType, SchemaForm, SchemaInstance } from './JsonForm'
import { parseProperties, Property, RefProperty } from './schemaParser/properties'
import { IfCondition, parseIfCondition } from './schemaParser/condition'
export function parseJsonSchema(schema: string): SchemaForm {
  let rawForm: RootSchema = JSON.parse(schema)
  return createForm(rawForm)
}
export function createForm(schema: RootSchema): SchemaForm {
  let parsingSchema = new ParsingSchema(getDefinitions(schema), schema)
  let primaryInstance = new SchemaInstance()
  if (parsingSchema.schema.if){
    primaryInstance.condition = parseIfCondition(parsingSchema.schema  as IfCondition,parsingSchema)
  }
  primaryInstance.required = schema.required ?? []
  if (parsingSchema.schema.properties) {
    primaryInstance.properties = parseProperties(parsingSchema)
  }
  let result = new SchemaForm(schema.$schema, schema.title ?? 'Form', primaryInstance)
  let allOf = Array<SchemaInstance>()
  for (const allOfRaw of schema.allOf ?? []) {
    let allOfInstance = new SchemaInstance()
    if (allOfRaw.if){
      allOfInstance.condition = parseIfCondition(allOfRaw as IfCondition,parsingSchema)
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

export { EnumInput, EnumValidator, StringInput, Property, RefProperty, Definitions, ObjectInputType, ArrayInput,BooleanInput, DefaultInput, NumberInput, FormConditionalInput, FormInputType  }
