import {
  FormInputType,
  InputValidator,
  SchemaHTMLInputEquivalence,
  ValidationResult
} from '../JsonForm'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser/schema'

export interface EnumValue {
  value: string
  name: string
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

export class EnumInput implements FormInputType {
  values: EnumValue[]
  propertyKey: string
  property: Property
  constructor(property: Property, propertyKey: string, values: EnumValue[]) {
    this.property = property
    this.values = values
    this.propertyKey = propertyKey
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
    let titleOrKey = this.title() ?? this.key()
    return `EnumInput: ${titleOrKey} with values ${JSON.stringify(this.values)}`
  }

  htmlElement(): SchemaHTMLInputEquivalence | undefined {
    return new SchemaHTMLInputEquivalence('select', {})
  }
  validator(): InputValidator {
    return new EnumValidator(this.values, this.property.default !== undefined)
  }
}
export function enumInputFromProperty(key: string, property: Property,
  parsingSchema: ParsingSchema): EnumInput | undefined {
  if (property.oneOf && !property.enum) {
    let oneOf = property.oneOf as Array<Property>
    let values = new Array<EnumValue>()
    for (const value of oneOf) {
      if (value.type !== 'string' && !value.const){
        return undefined
      }
      values.push({
        value: value.const as string,
        name: value.title ?? value.const as string,
        description: value.description
      })
    }
    return new EnumInput(property, key, values)
  } else if (!property.enum) {
    return undefined
  }
  let values = property.enum.map((value: string) => {
    return {
      value,
      name: value
    }
  })
  return new EnumInput(property, key, values)
}
