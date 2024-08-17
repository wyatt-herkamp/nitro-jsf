import * as fs from 'fs'
import { parseJsonSchema } from '../src/lib.js'

test('Parse Badge.json', () => {
  const schema = fs.readFileSync('test/schemas/Badge.json', 'utf8')
  const parsed = parseJsonSchema(schema)
  console.log(JSON.stringify(parsed, null, 2))
})
test('Evaluate Badge.json with empty object', () => {
  const schema = fs.readFileSync('test/schemas/Badge.json', 'utf8')
  const parsed = parseJsonSchema(schema)
  const properties = parsed.getProperties({})
  for (const property of properties) {
    console.log(property.debug())
  }
  const validationErrors = parsed.validate({})
  for (const error of validationErrors) {
    console.log(error)
  }
})
