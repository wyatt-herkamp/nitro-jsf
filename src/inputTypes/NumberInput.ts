import { FormInputType, InputValidator, SchemaHTMLInputEquivalence } from '../JsonForm'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser/schema'

export class NumberInput implements FormInputType {
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
    return this.property.type
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
    return `Bool: ${titleOrKey}`
  }
  htmlElement(): SchemaHTMLInputEquivalence | undefined {
    return new SchemaHTMLInputEquivalence('input', { type: 'text' })
  }
  validator(): InputValidator {
    return {
      validate: (value: any) => {
        if (typeof value === 'number') {
          return { success: false }
        }
        return { success: true }
      }
    }
  }
}
export function numberInputFromProperty(key: string, property: Property,
  parsingSchema: ParsingSchema): NumberInput | undefined {
  if (property.type !== 'number' && property.type !== 'integer') {
    return undefined
  }
  return new NumberInput(property, key)
}
