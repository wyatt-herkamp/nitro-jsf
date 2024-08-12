import { enumInputFromProperty } from '../inputTypes/EnumInput'
import { stringInputFromProperty } from '../inputTypes/StringInput'
import { FormInputType } from '../JsonForm'
import { ParsingSchema } from './schema'
import { DefaultInput } from '../inputTypes/DefaultInput'
import { booleanInputFromProperty } from '../inputTypes/BooleanInput'
import { numberInputFromProperty } from '../inputTypes/NumberInput'
import { objectInputFromProperty } from '../inputTypes/ObjectInput'
import { arrayInputFromProperty } from '../inputTypes/ArrayInput'

export interface Property {
  default?: any
  title?: string
  [key: string]: any
}
export interface TypedProperty extends Property {
  type: string
}
export interface RefProperty extends Property {
  $ref: string
}

export function parseProperties(parsing: ParsingSchema): Array<FormInputType> {
  let parsedProperties = Array<FormInputType>()
  for (const key in parsing.schema.properties) {
    if (Object.prototype.hasOwnProperty.call(parsing.schema.properties, key)) {
      const element = parsing.schema.properties[key]
      let parsed = parseProperty(key, element, parsing)
      parsedProperties.push(parsed)
    }
  }

  return parsedProperties
}
export function parseProperty(
  key: string,
  property: Property,
  parsing: ParsingSchema
): FormInputType {
  if (property['$ref']) {
    return parseRefProperty(key, property as RefProperty, parsing)
  } else {
    return parseTypedProperty(key, property, parsing)
  }
}

function parseRefProperty(
  key: string,
  property: RefProperty,
  parsing: ParsingSchema
): FormInputType {
  let ref = property['$ref']
  let definition = parsing.definitions.lookupDefinition(ref)
  return parseProperty(key, definition, parsing)
}
function parseTypedProperty(
  key: string,
  property: Property,
  parsing: ParsingSchema
): FormInputType {
  let resultInputType
  for (const parser of propertyParsers) {
    resultInputType = parser(key, property, parsing)
    if (resultInputType) {
      break
    }
  }
  if (!resultInputType) {
    console.warn(`No parser found for property with ${key}. ${JSON.stringify(property)}`)
    resultInputType = new DefaultInput(key, property)
  }
  console.debug(`[DEBUG] Parsed Property ${key} as ${resultInputType.debug()}`)
  return resultInputType
}

type PropertyParser = (key: string, property: Property,
  parsingSchema: ParsingSchema) => FormInputType | undefined
const propertyParsers: Array<PropertyParser> = [
  enumInputFromProperty,
  stringInputFromProperty,
  booleanInputFromProperty,
  numberInputFromProperty,
  arrayInputFromProperty,
  objectInputFromProperty
]
