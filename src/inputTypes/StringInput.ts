import validator from 'validator'
import {
  FormInputType,
  InputValidator,
  SchemaHTMLInputEquivalence,
  ValidationError,
  ValidationResult
} from '../JsonForm'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser/schema'
export enum StringFormat {
  DateTime = 'date-time',
  Date = 'date',
  Time = 'time',
  Duration = 'duration',
  Email = 'email',
  Hostname = 'hostname',
  UUID = 'uuid',
  CSSColor = 'color'
}
export class StringValidator implements InputValidator {
  minLength?: number
  maxLength?: number
  constructor(minLength?: number, maxLength?: number) {
    this.minLength = minLength
    this.maxLength = maxLength
  }
  validate(value: any): ValidationResult {
    if (typeof value !== 'string') {
      return {
        success: false,
        error: 'Value is not a string'
      }
    }
    if (this.minLength && value.length < this.minLength) {
      return {
        success: false,
        error: `Value is too short. Min length is ${this.minLength}`
      }
    }
    if (this.maxLength && value.length > this.maxLength) {
      return {
        success: false,
        error: `Value is too long. Max length is ${this.maxLength}`
      }
    }
    return { success: true }
  }
}
export class StringRegexValidator implements InputValidator {
  regex: string
  constructor(regex: string) {
    this.regex = regex
  }
  validate(value: any): ValidationResult {
    return { success: new RegExp(this.regex).test(value) }
  }
}
export class StringFormatValidator implements InputValidator {
  format: StringFormat
  constructor(format: StringFormat) {
    this.format = format
  }
  validate(value: any): ValidationResult {
    let result = false
    switch (this.format) {
      case StringFormat.Date:
        result = validator.isDate(value)
      case StringFormat.Time:
        result = validator.isTime(value)
      case StringFormat.Email:
        result = validator.isEmail(value)
      case StringFormat.UUID:
        result = validator.isUUID(value)
      default:
        console.warn(`StringFormatValidator: ${this.format as string} not implemented`)
    }
    return {
      success: result
    }
  }
}

export class StringInput implements FormInputType {
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
    return 'string'
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
    let titleOrKey = this.title() ?? this.key()
    return `StringInput: ${titleOrKey}`
  }
  htmlElement(): SchemaHTMLInputEquivalence | undefined {
    return new SchemaHTMLInputEquivalence('input', { type: 'text' })
  }
  validator(): InputValidator {
    if (this.property.format) {
      return new StringFormatValidator(this.property.format as StringFormat)
    }
    if (this.property.pattern) {
      return new StringRegexValidator(this.property.pattern)
    }
    return new StringValidator(this.property.minLength, this.property.maxLength)
  }
}
export function stringInputFromProperty(key: string, property: Property,
  parsingSchema: ParsingSchema): StringInput | undefined {
  if (property.type !== 'string') {
    return undefined
  }
  return new StringInput(property, key)
}
