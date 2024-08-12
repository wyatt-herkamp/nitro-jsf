import { ConditionInput } from './condition'
import { Definition } from './def'
import { Property } from './properties'
export class ParsingSchema {
  definitions: Definition
  schema: BaseSchema
  constructor(definitions: Definition, schema: BaseSchema) {
    this.definitions = definitions
    this.schema = schema
  }
}
export interface BaseSchema {
  title?: string
  properties?: Record<string, Property>
  required?: Array<string>
  anyOf?: Array<BaseSchema>
  allOf?: Array<BaseSchema>
  oneOf?: Array<BaseSchema>
  not?: ConditionInput
  if?: ConditionInput
  then?: ConditionInput
  else?: ConditionInput
  [key: string]: any
}

export interface RootSchema extends BaseSchema {
  $schema: string
}
