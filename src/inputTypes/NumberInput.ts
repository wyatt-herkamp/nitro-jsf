import {
  CompositeValidator,
  FormInputType,
  InputValidator,
  SchemaHTMLInputEquivalence,
  ValidationResult
} from '../jsonForm'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser/schema'
export class isInteger implements InputValidator {
  validate(value: any): ValidationResult {
    return { success: Number.isInteger(value) }
  }
}
export class MaximumValidator implements InputValidator {
  maximum: number
  isExclusive: boolean
  constructor(maximum: number, isExclusive: boolean = false) {
    this.maximum = maximum
    this.isExclusive = isExclusive
  }
  validate(value: any): ValidationResult {
    if (this.isExclusive) {
      return { success: value < this.maximum }
    }
    return { success: value <= this.maximum }
  }
}
export class MinimumValidator implements InputValidator {
  minimum: number
  isExclusive: boolean
  constructor(minimum: number, isExclusive: boolean = false) {
    this.minimum = minimum
    this.isExclusive = isExclusive
  }
  validate(value: any): ValidationResult {
    if (this.isExclusive) {
      return { success: value > this.minimum }
    }
    return { success: value >= this.minimum }
  }
}
export class MultipleOfValidator implements InputValidator {
  multipleOf: number
  constructor(multipleOf: number) {
    this.multipleOf = multipleOf
  }
  validate(value: any): ValidationResult {
    return { success: value % this.multipleOf === 0 }
  }
}
export interface NumberProperty extends Property {
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  multipleOf?: number
}
export class NumberInput implements FormInputType {
  property: NumberProperty
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
    const titleOrKey = this.title ?? this.key
    return `Bool: ${titleOrKey}`
  }
  htmlElement(): SchemaHTMLInputEquivalence | undefined {
    return new SchemaHTMLInputEquivalence('input', { type: 'text' })
  }
  validator(): InputValidator {
    const validators = Array<InputValidator>()
    if (this.property.type === 'integer') {
      validators.push(new isInteger())
    }
    if (this.property.maximum) {
      validators.push(new MaximumValidator(this.property.maximum))
    } else if (this.property.exclusiveMaximum) {
      validators.push(new MaximumValidator(this.property.exclusiveMaximum, true))
    }
    if (this.property.minimum) {
      validators.push(new MinimumValidator(this.property.minimum))
    } else if (this.property.exclusiveMinimum) {
      validators.push(new MinimumValidator(this.property.exclusiveMinimum, true))
    }
    if (this.property.multipleOf) {
      validators.push(new MultipleOfValidator(this.property.multipleOf))
    }
    return new CompositeValidator(validators)
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
export function numberInputFromProperty(
  key: string,
  property: Property,
  parsingSchema: ParsingSchema
): NumberInput | undefined {
  if (property.type !== 'number' && property.type !== 'integer') {
    return undefined
  }
  const numberProperty = property as NumberProperty
  if (property.minimum && property.exclusiveMinimum) {
    throw new Error('minimum and exclusiveMinimum cannot be used together')
  }
  if (property.maximum && property.exclusiveMaximum) {
    throw new Error('maximum and exclusiveMaximum cannot be used together')
  }

  return new NumberInput(property, key)
}
