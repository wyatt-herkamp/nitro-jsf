import validator from 'validator'
import { FormInputType, InputValidator, CompositeValidator, ValidationResult } from './index'
import { Property } from '../lib'
import { ParsingSchema } from '../schemaParser'
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
export class MinLengthValidator implements InputValidator {
  minLength: number
  constructor(minLength: number) {
    this.minLength = minLength
  }
  validate(value: any): ValidationResult {
    return { success: value.length >= this.minLength }
  }
}
export class MaxLengthValidator implements InputValidator {
  maxLength: number
  constructor(maxLength: number) {
    this.maxLength = maxLength
  }
  validate(value: any): ValidationResult {
    return { success: value.length <= this.maxLength }
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
        break
      case StringFormat.Time:
        result = validator.isTime(value)
        break
      case StringFormat.Email:
        result = validator.isEmail(value)
        break
      case StringFormat.UUID:
        result = validator.isUUID(value)
        break
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
  originalProperty(): Property {
    return this.property
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
    const titleOrKey = this.title() ?? this.key()
    return `StringInput: ${titleOrKey}`
  }

  validator(): InputValidator {
    const validators = Array<InputValidator>()
    if (this.property.minLength) {
      validators.push(new MinLengthValidator(this.property.minLength))
    }
    if (this.property.maxLength) {
      validators.push(new MaxLengthValidator(this.property.maxLength))
    }
    if (this.property.pattern) {
      validators.push(new StringRegexValidator(this.property.pattern))
    }
    if (this.property.format) {
      validators.push(new StringFormatValidator(this.property.format))
    }
    return new CompositeValidator(validators)
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getProperties(_input: any): Array<FormInputType> | undefined {
    return undefined
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
export function stringInputFromProperty(
  key: string,
  property: Property,
  parsingSchema: ParsingSchema
): StringInput | undefined {
  if (property.type !== 'string') {
    return undefined
  }
  return new StringInput(property, key)
}
