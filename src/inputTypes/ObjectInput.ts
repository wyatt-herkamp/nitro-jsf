import { FormInputType } from './../JsonForm'
import { InputValidator, SchemaHTMLInputEquivalence } from '../JsonForm'
import { Property } from '../lib'
import { DefaultInput } from './DefaultInput'
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
    let titleOrKey = this.title ?? this.key
    let itemsDebug = this.items.map((item) => item.debug()).join(', ')
    return `Object: ${titleOrKey} [${itemsDebug}]`
  }

  htmlElement(): SchemaHTMLInputEquivalence | undefined {
    // This tells the form renderer. That this is a subform
    return new SchemaHTMLInputEquivalence('form', {})
  }
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
  parsingSchema: ParsingSchema,
): ObjectInputType | undefined {
  if (property.type !== 'object') {
    return undefined
  }
  let items = new Array<FormInputType>()
  for (const [key, value] of Object.entries(property.properties)) {
    let property = parseProperty(key, value, parsingSchema)
    console.debug(`[DEBUG] Property in ObjectInput: ${property.debug()}`)
    items.push(property)
  }
  return new ObjectInputType(property, key, items)
}
