import {
  EqualsFormCondition,
  FormCondition,
  FormConditionalInput,
  FormInputType
} from '../JsonForm'
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
  let ifCondition = schemaConditionStatement.if
  let thenCondition = schemaConditionStatement.then
  if (!ifCondition.properties) {
    throw new Error('Currently only properties are supported in if conditions')
  }
  if (!thenCondition) {
    throw new Error('Then condition is required')
  }
  let conditions = Array<FormCondition>()
  let extraProperties = Array<FormInputType>()
  let elseProperties = Array<FormInputType>()
  let ifProperties = ifCondition.properties
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
  let thenProperties = schemaConditionStatement.then.properties
  for (const key in thenProperties) {
    if (Object.prototype.hasOwnProperty.call(thenProperties, key)) {
      const element = thenProperties[key]
      let parse = parseProperty(key, element, parsingSchema)
      console.debug(`[DEBUG] Adding an property on a condition: ${JSON.stringify(parse)}`)
      extraProperties.push(parse)
    }
  }

  if (schemaConditionStatement.else) {
    let rawElseProperties = schemaConditionStatement.else.properties
    for (const key in rawElseProperties) {
      if (Object.prototype.hasOwnProperty.call(rawElseProperties, key)) {
        const element = rawElseProperties[key]
        let parse = parseProperty(key, element, parsingSchema)
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
