import { Property } from '../lib'
export enum ValidationErrorType {
  Undefined,
  Required,
  NoValidatorForType
}
/**
 * A ValidationResult is used to check if a value is valid or not.
 *
 * If the success property is true, then the value is valid.
 * If the success property is false, then the value is invalid. The error property should contain a message explaining why the value is invalid.
 */
export interface ValidationResult {
  success: boolean
  error?: string
  type?: ValidationErrorType
}

/**
 * An InputValidator is used to check if a value is valid or not.
 */
export interface InputValidator {
  /**
   *
   * @param value The value to validate
   */
  validate(value: any): ValidationResult
}

/**
 * A ValidationError is used to show the user what is wrong with the value.
 */
export class ValidationError {
  property: string
  message?: string
  type?: ValidationErrorType
  /**
   *
   * @param property Property that is invalid
   * @param message  Message explaining why the property is invalid
   */
  constructor(property: string, message?: string, type?: ValidationErrorType) {
    this.property = property
    this.message = message
    this.type = type
  }
}

/**
 * Checks if all validators pass.
 * Used to combine multiple validators.
 */
export class CompositeValidator implements InputValidator {
  validators: Array<InputValidator>
  /**
   * Creates a new CompositeValidator
   * @param validators The validators to check
   */
  constructor(validators: Array<InputValidator>) {
    this.validators = validators
  }
  validate(value: any): ValidationResult {
    for (const validator of this.validators) {
      const result = validator.validate(value)
      if (!result.success) {
        return result
      }
    }
    return { success: true }
  }
}

export interface FormInputType {
  /**
   * InputValidator is used to validate the input.
   */
  validator(): InputValidator
  /**
   * Internally used for debugging purposes.
   */
  debug(): string

  title(): string | undefined
  /**
   * The Type of the input. This is not the same as the property type from JSON Schema.
   * This is used as a way to hint what kind of input should be used.
   */
  type(): string
  /**
   * This is the source property from the JSON Schema. This is used to get the original property if needed.
   */
  originalProperty(): Property

  key(): string
  /**
   * The description of the input. This is used to show the user what the input is for.
   */
  description(): string | undefined
  /**
   * If the property is required or not.
   */
  isRequired(): boolean
  /**
   * If the property is read only or not.
   */
  readOnly(): boolean
  /**
   * If the property is write only or not.
   */
  writeOnly(): boolean
  /**
   * If the property is deprecated or not.
   */
  deprecated(): boolean
  /**
   * The default value of the property.
   */
  default(): any | undefined
}
export * from './NumberInput'
export * from './DefaultInput'
export * from './BooleanInput'
export * from './ArrayInput'
export * from './ObjectInput'
export * from './StringInput'
export * from './EnumInput'
