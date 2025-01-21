import { FormInputType, InputValidator, ValidationResult } from './index'
import { parseProperty, Property } from '../lib'
import { ParsingSchema } from '../schemaParser'
import { BaseSchema } from '../../dist/lib'

export interface EnumValue {
  keyProperty: string
  value: FormInputType | undefined
  title?: string
  description?: string
}

export class EnumValidator implements InputValidator {
  values: EnumValue[]
  keyProperty: string
  valueProperty: string
  hasDefaultValue: boolean = false
  constructor(
    values: EnumValue[],
    keyProperty: string,
    valueProperty: string,
    hasDefaultValue: boolean = false
  ) {
    this.values = values
    this.keyProperty = keyProperty
    this.hasDefaultValue = hasDefaultValue
    this.valueProperty = valueProperty
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any): ValidationResult {
    return { success: true }
  }
}
/**
 * The EnumInput class is used if the type has the enum property. Or if it has the oneOf property with all the values being strings.
 */
export class AdjacentEnumInput implements FormInputType {
  values: EnumValue[]
  propertyKey: string
  valueKey: string
  property: Property | undefined
  constructor(
    property: Property | undefined,
    propertyKey: string,
    valuekey: string,
    values: EnumValue[]
  ) {
    this.property = property
    this.values = values
    this.valueKey = valuekey
    this.propertyKey = propertyKey
  }
  originalProperty(): Property | undefined {
    return this.property
  }
  title(): string | undefined {
    return this.property?.title ?? this.propertyKey
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
    return new EnumValidator(
      this.values,
      this.propertyKey,
      this.valueKey,
      this.property?.default !== undefined
    )
  }
  getProperties(input: any): Array<FormInputType> | undefined {
    if (input === undefined) {
      return undefined
    }
    const value = input[this.propertyKey]
    if (value === undefined) {
      return undefined
    }
    const enumValue = this.values.find((enumValue) => enumValue.keyProperty === value)
    if (enumValue) {
      return [enumValue.value]
    }
  }
}

export function enumInputAdjacentTagged(
  keyProperty: string,
  valueProperty: string,
  enumDef: Array<BaseSchema>,
  parsingSchema: ParsingSchema
): AdjacentEnumInput | undefined {
  const values = new Array<EnumValue>()
  for (const enumValue of enumDef) {
    const title = enumValue.title ?? enumValue.key
    let valuePropertyValue = undefined
    let keyPropertyValue = undefined
    if (enumValue.properties) {
      const property = enumValue.properties[valueProperty]
      if (property) {
        valuePropertyValue = parseProperty(valueProperty, property, parsingSchema)
      }
      const keyPropertyProperty = enumValue.properties[keyProperty]
      if (keyPropertyProperty && keyPropertyProperty.const !== undefined) {
        keyPropertyValue = keyPropertyProperty.const
      }
    }
    values.push({
      keyProperty: keyPropertyValue,
      value: valuePropertyValue,
      title: title,
      description: enumValue.description
    })
  }

  return new AdjacentEnumInput(undefined, keyProperty, valueProperty, values)
}
