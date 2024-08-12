import {
  EqualsFormCondition,
  FormCondition,
  FormConditionalInput,
  FormInputType
} from '../jsonForm'
import { ParsingSchema } from './schema'
import { parseProperty, Property } from './properties'
export interface NotCondition {
  not: ConditionInput
}
export interface IfCondition {
  if: ConditionInput
  then: ConditionInput
  else?: ConditionInput
}
export interface ConditionProperty extends Property {
  const?: any
}

export interface ConditionInput {
  properties?: Record<string, ConditionProperty>
  required?: Array<string>
  [key: string]: any
}

export function parseIfCondition(
  schemaConditionStatement: IfCondition,
  parsingSchema: ParsingSchema
): FormConditionalInput {
  const ifCondition = schemaConditionStatement.if
  const thenCondition = schemaConditionStatement.then
  if (!ifCondition.properties) {
    throw new Error('Currently only properties are supported in if conditions')
  }
  if (!thenCondition) {
    throw new Error('Then condition is required')
  }
  const conditions = Array<FormCondition>()
  const extraProperties = Array<FormInputType>()
  const elseProperties = Array<FormInputType>()
  const ifProperties = ifCondition.properties
  for (const key in ifProperties) {
    if (Object.prototype.hasOwnProperty.call(ifProperties, key)) {
      const element = ifProperties[key]
      let parsedCondition
      if (element.const) {
        parsedCondition = new EqualsFormCondition(key, element.const)
      }
      if (!parsedCondition) {
        throw new Error(`Unsupported condition: ${JSON.stringify(element)}`)
      }
      conditions.push(parsedCondition)
    }
  }
  const thenProperties = schemaConditionStatement.then.properties
  for (const key in thenProperties) {
    if (Object.prototype.hasOwnProperty.call(thenProperties, key)) {
      const element = thenProperties[key]
      const parse = parseProperty(key, element, parsingSchema)
      console.debug(`[DEBUG] Adding an property on a condition: ${JSON.stringify(parse)}`)
      extraProperties.push(parse)
    }
  }

  if (schemaConditionStatement.else) {
    const rawElseProperties = schemaConditionStatement.else.properties
    for (const key in rawElseProperties) {
      if (Object.prototype.hasOwnProperty.call(rawElseProperties, key)) {
        const element = rawElseProperties[key]
        const parse = parseProperty(key, element, parsingSchema)
        console.debug(`[DEBUG] Adding an property if condition is false: ${JSON.stringify(parse)}`)
        elseProperties.push(parse)
      }
    }
  }
  return {
    conditions,
    extraProperties: extraProperties,
    elseProperties: elseProperties
  }
}
