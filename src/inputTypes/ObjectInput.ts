import { FormInputType } from './index'
import { InputValidator } from './index'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser'
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
  validator(): InputValidator {
    // TODO: Implement Object Validator
    return {
      validate: (value: any) => {
        console.warn(`No validator for ${typeof value} in ObjectInput`)
        return { success: true }
      }
    }
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getProperties(_input: any): Array<FormInputType> | undefined {
    return undefined
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
