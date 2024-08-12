import * as fs from 'fs'
import { parseJsonSchema } from '../src/lib.js'

test('Parse PageType.json', () => {
  const schema = fs.readFileSync('test/schemas/PageType.json', 'utf8')
  const parsed = parseJsonSchema(schema)
  console.log(JSON.stringify(parsed, null, 2))
})

test('Evaluate PageType.json with empty object', () => {
  const schema = fs.readFileSync('test/schemas/PageType.json', 'utf8')
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

test('Evaluate PageType.json with Enum set to "Markdown"', () => {
  const schema = fs.readFileSync('test/schemas/PageType.json', 'utf8')
  const parsed = parseJsonSchema(schema)
  const properties = parsed.getProperties({ pageType: 'Markdown' })
  for (const property of properties) {
    console.log(property.debug())
  }
  const validationErrors = parsed.validate({ pageType: 'Markdown' })
  for (const error of validationErrors) {
    console.log(error)
  }
})
