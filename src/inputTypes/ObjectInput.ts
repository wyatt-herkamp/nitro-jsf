import { FormInputType } from '../jsonForm'
import { InputValidator, SchemaHTMLInputEquivalence } from '../jsonForm'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser/schema'
import { parseProperty } from '../schemaParser/properties'

export class ObjectInputType implements FormInputType {
  propertyKey: string
  property: Property
  public items: FormInputType[]
  constructor(property: Property, propertyKey: string, items: FormInputType[]) {
    this.property = property
    this.propertyKey = propertyKey
    this.items = items
  }
  originalProperty(): Property {
    return this.property
  }
  title(): string | undefined {
    return this.property.title
  }
  type(): string {
    return 'object'
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
    const itemsDebug = this.items.map((item) => item.debug()).join(', ')
    return `Object: ${titleOrKey} [${itemsDebug}]`
  }

  htmlElement(): SchemaHTMLInputEquivalence | undefined {
    // This tells the form renderer. That this is a subform
    return new SchemaHTMLInputEquivalence('form', {})
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  validator(): InputValidator {
    // TODO: Implement Object Validator
    return {
      validate: (value: any) => {
        return { success: true }
      }
    }
  }
}
export function objectInputFromProperty(
  key: string,
  property: Property,
  parsingSchema: ParsingSchema
): ObjectInputType | undefined {
  if (property.type !== 'object') {
    return undefined
  }
  const items = new Array<FormInputType>()
  for (const [key, value] of Object.entries(property.properties)) {
    const property = parseProperty(key, value, parsingSchema)
    console.debug(`[DEBUG] Property in ObjectInput: ${property.debug()}`)
    items.push(property)
  }
  return new ObjectInputType(property, key, items)
}
