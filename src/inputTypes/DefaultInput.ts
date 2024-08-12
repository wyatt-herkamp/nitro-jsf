import { FormInputType } from '../jsonForm'
import { InputValidator, SchemaHTMLInputEquivalence } from '../jsonForm'
import { Property } from '../lib'

export class DefaultInput implements FormInputType {
  propertyKey: string
  property: Property
  constructor(propertyKey: string, property: Property) {
    this.property = property
    this.propertyKey = propertyKey
  }
  originalProperty(): Property {
    return this.property
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
    const title = this.title() ?? this.key()
    return `${this.type}: ${title}`
  }
  htmlElement(): SchemaHTMLInputEquivalence | undefined {
    return undefined
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  validator(): InputValidator {
    return {
      validate: (value: any) => {
        return { success: false, message: 'No validator for this type' }
      }
    }
  }
}
