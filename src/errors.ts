import { Property, SUPPORTED_SCHEMA_VERSIONS } from './schemaParser'

export class UnsupportedSchemaError extends Error {
  constructor(schema: string) {
    super(
      `Unsupported schema version: ${schema} Supported versions: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`
    )
    this.name = 'UnsupportedSchemaError'
  }
}

export class InvalidPropertyTypeError extends Error {
  sourceProperty: Property
  key: string
  /**
   *
   * @param key The key of the property
   * @param source The property that has the invalid type
   */
  constructor(key: string, source: Property) {
    super(`Invalid property type: ${source.type}. Key: ${key}`)
    this.sourceProperty = source
    this.key = key
    this.name = 'InvalidPropertyTypeError'
  }
}
