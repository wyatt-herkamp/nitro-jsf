import { FormInputType, InputValidator, ValidationResult } from './index'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser'

export interface EnumValue {
  value: any
  title?: string
  description?: string
}

export class EnumValidator implements InputValidator {
  values: EnumValue[]
  hasDefaultValue: boolean = false
  constructor(values: EnumValue[], hasDefaultValue: boolean = false) {
    this.values = values
    this.hasDefaultValue = hasDefaultValue
  }
  validate(value: any): ValidationResult {
    if (value === undefined) {
      if (this.hasDefaultValue) {
        return { success: true }
      }
      return { success: false, error: 'Value is undefined' }
    }
    if (typeof value !== 'string') {
      return { success: false, error: 'Value is not a string' }
    }
    if (!this.values.map((v) => v.value).includes(value)) {
      return { success: false, error: 'Value is not in the list of valid values' }
    }
    return { success: true }
  }
}
/**
 * The EnumInput class is used if the type has the enum property. Or if it has the oneOf property with all the values being strings.
 */
export class EnumInput implements FormInputType {
  values: EnumValue[]
  propertyKey: string
  property: Property
  constructor(property: Property, propertyKey: string, values: EnumValue[]) {
    this.property = property
    this.values = values
    this.propertyKey = propertyKey
  }
  originalProperty(): Property {
    return this.property
  }
  title(): string | undefined {
    return this.property.title
  }
  type(): string {
    return 'enum'
  }
  key(): string {
    return this.propertyKey
  }
  description(): string | undefined {
    return this.property.description
  }
  isRequired(): boolean {
    return this.property.required ?? false
  }
  readOnly(): boolean {
    return this.property.readOnly ?? false
  }
  writeOnly(): boolean {
    return this.property.writeOnly ?? false
  }
  deprecated(): boolean {
    return this.property.deprecated ?? false
  }
  default() {
    return this.property.default
  }
  debug(): string {
    const titleOrKey = this.title() ?? this.key()
    return `EnumInput: ${titleOrKey} with values ${JSON.stringify(this.values)}`
  }

  validator(): InputValidator {
    return new EnumValidator(this.values, this.property.default !== undefined)
  }
}
export function enumInputFromProperty(
  key: string,
  property: Property,
  parsingSchema: ParsingSchema
): EnumInput | undefined {
  if (property.oneOf && !property.enum) {
    return enumInputFromOneOf(key, property, parsingSchema)
  } else if (!property.enum) {
    return undefined
  }
  const values = property.enum.map((value: string) => {
    return {
      value
    }
  })
  return new EnumInput(property, key, values)
}
/* eslint-disable @typescript-eslint/no-unused-vars */
function enumInputFromOneOf(
  key: string,
  property: Property,
  parsingSchema: ParsingSchema
): EnumInput | undefined {
  if (!property.oneOf && !property.enum) {
    return undefined
  }
  const oneOf = property.oneOf as Array<Property>
  const values = new Array<EnumValue>()
  for (const value of oneOf) {
    if (!value.const) {
      console.debug(
        '[POSSIBLE_ERROR] If this is supposed to be an enum, it should have a const property'
      )
      return undefined
    }
    if (value.type !== 'string') {
      return undefined
    }
    console.debug(`[DEBUG] Found Enum Entry ${JSON.stringify(value)}`)
    values.push({
      value: value.const,
      title: value.title,
      description: value.description
    })
  }
  return new EnumInput(property, key, values)
}
