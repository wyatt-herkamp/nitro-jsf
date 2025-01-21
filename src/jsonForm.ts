import { FormInputType, ValidationError } from './inputTypes'

export class SchemaInstance {
  public properties: Array<FormInputType>
  public condition?: FormConditionalInput
  public required: Array<string>

  getProperties(input: any): Array<FormInputType> {
    const result = new Array<FormInputType>()
    for (const property of this.properties) {
      console.debug(`[DEBUG] Adding property: ${property.debug()}`)
      result.push(property)
      const subProperties = property.getProperties(input)
      if (subProperties) {
        for (const subProperty of subProperties) {
          console.debug(`[DEBUG] Adding sub property: ${subProperty.debug()}`)
          result.push(subProperty)
        }
      }
    }
    if (this.condition) {
      console.debug(`[DEBUG] Checking condition: ${JSON.stringify(this.condition)}`)
      let conditionMet = true
      for (const conditionCheck of this.condition.conditions) {
        if (!conditionCheck.check(input)) {
          conditionMet = false
          break
        }
      }
      if (conditionMet) {
        console.debug(
          `[DEBUG] Condition met: ${JSON.stringify(this.condition)} adding extra properties`
        )
        for (const extraProperty of this.condition.extraProperties) {
          console.debug(`[DEBUG] Adding extra property: ${extraProperty.debug()}`)
          result.push(extraProperty)
        }
      } else {
        console.debug(
          `[DEBUG] Condition not met: ${JSON.stringify(this.condition)} adding else properties`
        )
        for (const elseProperty of this.condition.elseProperties) {
          console.debug(`[DEBUG] Adding else property: ${elseProperty.debug()}`)
          result.push(elseProperty)
        }
      }
    }
    return result
  }
}

export class SchemaForm {
  public schema: string
  public primary: SchemaInstance
  public allOf: Array<SchemaInstance>
  public anyOf: Array<SchemaInstance>
  public title: string

  constructor(schema: string, title: string, instance: SchemaInstance) {
    this.schema = schema
    this.primary = instance
    this.title = title
  }
  /**
   * Evaluates a current input and returns the properties that should be used
   *
   * @param input Input to evaluate
   */
  getProperties(input: any): Array<FormInputType> {
    const result = this.primary.getProperties(input)
    for (const allOf of this.allOf) {
      const allOfProperties = allOf.getProperties(input)
      for (const property of allOfProperties) {
        result.push(property)
      }
    }
    return result
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  getRequired(input: any): Array<string> {
    const result = new Array<string>()
    for (const required of this.primary.required) {
      result.push(required)
    }
    for (const allOf of this.allOf) {
      for (const required of allOf.required) {
        result.push(required)
      }
    }
    return result
  }
  validate(input: any): Array<ValidationError> {
    const properties = this.getProperties(input)
    const required = this.getRequired(input)
    for (const requiredProperty of required) {
      if (!input[requiredProperty]) {
        const property = properties.find((property) => property.key() === requiredProperty)
        if (!property) {
          console.warn(`Required property ${requiredProperty} not found in schema`)
          continue
        }
        if (property.default()) {
          console.debug(
            `[DEBUG] Setting default value for ${requiredProperty} to ${property.default()}`
          )
          input[requiredProperty] = property.default()
          continue
        }
        return [new ValidationError(requiredProperty, 'Required property not found')]
      }
    }
    const errors = new Array<ValidationError>()
    for (const property of properties) {
      if (Array.isArray(property.key())) {
        console.debug(`[DEBUG] Skipping array property ${property.key()}`)
        continue
      } else {
        const validationResult = property.validator().validate(input[property.key() as string])
        if (!validationResult.success) {
          errors.push(new ValidationError(property.key() as string, validationResult.error))
        }
      }
    }
    return errors
  }
}

export interface FormCondition {
  check(value: any): boolean
}
export class EqualsFormCondition implements FormCondition {
  key: string
  value: any
  constructor(key: string, value: any) {
    this.key = key
    this.value = value
  }
  check(value: any): boolean {
    return value[this.key] === this.value
  }
}
export interface FormConditionalInput {
  conditions: Array<FormCondition>
  extraProperties: Array<FormInputType>
  elseProperties: Array<FormInputType>
}
