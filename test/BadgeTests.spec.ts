import * as fs from 'fs'
import { parseJsonSchema } from '../src/lib.js'

test('Parse Badge.json', () => {
  let schema = fs.readFileSync('test/schemas/Badge.json', 'utf8')
  let parsed = parseJsonSchema(schema)
  console.log(JSON.stringify(parsed, null, 2))
})
test('Evaluate Badge.json with empty object', () => {
  let schema = fs.readFileSync('test/schemas/Badge.json', 'utf8')
  let parsed = parseJsonSchema(schema)
  let properties = parsed.getProperties({})
  for (const property of properties) {
    console.log(property.debug())
  }
  let validationErrors = parsed.validate({})
  for (const error of validationErrors) {
    console.log(error)
  }
})
