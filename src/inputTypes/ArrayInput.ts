import { CompositeValidator, FormInputType, InputValidator, ValidationResult } from './index'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser'
export enum ContainsOptions {
  number = 'number',
  integer = 'integer',
  string = 'string',
  object = 'object',
  array = 'array',
  Other = 'other'
}
export class ContainsTypeValidator implements InputValidator {
  type: ContainsOptions
  minimumMatches: number
  maximumMatches?: number
  constructor(
    type: ContainsOptions,
    minimumMatches: number = 1,
    maximumMatches: number = undefined
  ) {
    this.minimumMatches = minimumMatches
    this.maximumMatches = maximumMatches
    this.type = type
  }
  validate(value: any): ValidationResult {
    if (!Array.isArray(value)) {
      return { success: false, error: 'Value is not an array' }
    }
    const array = value as Array<any>
    let matchingItems = 0
    for (const item of array) {
      switch (this.type) {
        case ContainsOptions.number:
          if (typeof item === 'number') {
            matchingItems++
          }
          break
        case ContainsOptions.integer:
          if (Number.isInteger(item)) {
            matchingItems++
          }
          break
        case ContainsOptions.string:
          if (typeof item === 'string') {
            matchingItems++
          }
          break
        case ContainsOptions.object:
          if (typeof item === 'object') {
            matchingItems++
          }
          break
        case ContainsOptions.array:
          if (Array.isArray(item)) {
            matchingItems++
          }
          break
        default:
          console.error('Unknown type')
          matchingItems++
          break
      }
    }
    if (matchingItems <= this.minimumMatches) {
      return { success: false, error: 'Array does not contain enough items of the specified type' }
    }
    if (this.maximumMatches && matchingItems > this.maximumMatches) {
      return { success: false, error: 'Array contains too many items of the specified type' }
    }
    return { success: true }
  }
}
export class MinimumItemsValidator implements InputValidator {
  minimumItems: number
  constructor(minimumItems: number) {
    this.minimumItems = minimumItems
  }
  validate(value: any): ValidationResult {
    if (!Array.isArray(value)) {
      return { success: false, error: 'Value is not an array' }
    }
    const array = value as Array<any>
    if (array.length < this.minimumItems) {
      return { success: false, error: 'Array does not have enough items' }
    }
    return { success: true }
  }
}
export class MaximumItemsValidator implements InputValidator {
  maximumItems: number
  constructor(maximumItems: number) {
    this.maximumItems = maximumItems
  }
  validate(value: any): ValidationResult {
    if (!Array.isArray(value)) {
      return { success: false, error: 'Value is not an array' }
    }
    const array = value as Array<any>
    if (array.length > this.maximumItems) {
      return { success: false, error: 'Array has too many items' }
    }
    return { success: true }
  }
}
export class UniqueItemsValidator implements InputValidator {
  validate(value: any): ValidationResult {
    if (!Array.isArray(value)) {
      return { success: false, error: 'Value is not an array' }
    }
    const array = value as Array<any>
    const uniqueItems = new Set(array)
    if (uniqueItems.size !== array.length) {
      return { success: false, error: 'Array has duplicate items' }
    }
    return { success: true }
  }
}
export interface ArrayProperty extends Property {
  contains?: {
    type: any
  }
  minItems?: number
  maxItems?: number
  minContains?: number
  maxContains?: number
  uniqueItems?: boolean
}
export class ArrayInput implements FormInputType {
  property: ArrayProperty
  propertyKey: string
  constructor(property: ArrayProperty, propertyKey: string) {
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
    const titleOrKey = this.title ?? this.key
    return `Array: ${titleOrKey}`
  }

  validator(): InputValidator {
    const validators = Array<InputValidator>()
    if (this.property.minItems) {
      validators.push(new MinimumItemsValidator(this.property.minItems))
    }
    if (this.property.uniqueItems) {
      validators.push(new UniqueItemsValidator())
    }
    if (this.property.contains) {
      const type = this.property.contains.type
      const minimumMatches = this.property.minContains ?? 1
      const maximumMatches = this.property.maxItems
      validators.push(new ContainsTypeValidator(type, minimumMatches, maximumMatches))
    }
    return new CompositeValidator(validators)
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getProperties(_input: any): Array<FormInputType> | undefined {
    return undefined
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
export function arrayInputFromProperty(
  key: string,
  property: Property,
  parsingSchema: ParsingSchema
): ArrayInput | undefined {
  if (property.type !== 'string') {
    return undefined
  }
  return new ArrayInput(property, key)
}
