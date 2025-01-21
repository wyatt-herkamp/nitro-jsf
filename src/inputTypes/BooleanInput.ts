import { FormInputType, InputValidator } from './index'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser'

export class BooleanInput implements FormInputType {
  property: Property
  propertyKey: string
  constructor(property: Property, propertyKey: string) {
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
    return 'boolean'
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
    const titleOrKey = this.title ?? this.key
    return `Bool: ${titleOrKey}`
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getProperties(_input: any): Array<FormInputType> | undefined {
    return undefined
  }
  validator(): InputValidator {
    return {
      validate: (value: any) => {
        if (typeof value === 'boolean') {
          return { success: false }
        }
        return { success: true }
      }
    }
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
export function booleanInputFromProperty(
  key: string,
  property: Property,
  parsingSchema: ParsingSchema
): BooleanInput | undefined {
  if (property.type !== 'boolean') {
    return undefined
  }
  return new BooleanInput(property, key)
}
