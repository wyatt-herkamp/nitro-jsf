import { FormInputType } from './../JsonForm'
import { InputValidator, SchemaHTMLInputEquivalence } from '../JsonForm'
import { Property } from '../lib'

export class DefaultInput implements FormInputType {
  propertyKey: string
  property: Property
  constructor(propertyKey: string, property: Property) {
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
    let title = this.title() ?? this.key()
    return `${this.type}: ${title}`
  }
  htmlElement(): SchemaHTMLInputEquivalence | undefined {
    return undefined
  }
  validator(): InputValidator {
    return {
      validate: (value: any) => {
        return { success: false, message: 'No validator for this type' }
      }
    }
  }
}
