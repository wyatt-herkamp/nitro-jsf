import {
  FormInputType,
  InputValidator,
  SchemaHTMLInputEquivalence,
  ValidationError,
  ValidationResult
} from '../JsonForm'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser/schema'

export class ArrayInput implements FormInputType {
  property: Property
  propertyKey: string
  constructor(property: Property, propertyKey: string) {
    this.property = property
    this.propertyKey = propertyKey
  }
  title(): string | undefined {
    return this.property.title
  }
  type(): string {
    return 'array'
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
    let titleOrKey = this.title ?? this.key
    return `Array: ${titleOrKey}`
  }
  htmlElement(): SchemaHTMLInputEquivalence | undefined {
    // It is a list of items, so we use ul
    return new SchemaHTMLInputEquivalence('ul', {})
  }
  validator(): InputValidator {
    return {
      validate: (value: any) => {
        if (!Array.isArray(value)) {
          return {
            success: false,
            message: 'Value is not an array'
          } as ValidationResult
        }
        let asArray = value as Array<any>

        return { success: true } as ValidationResult
      }
    }
  }
}
export function arrayInputFromProperty(key: string, property: Property,
  parsingSchema: ParsingSchema): ArrayInput | undefined {
  if (property.type !== 'string') {
    return undefined
  }
  return new ArrayInput(property, key)
}
