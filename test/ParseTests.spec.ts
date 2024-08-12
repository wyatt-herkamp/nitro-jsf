import { assertType, expectTypeOf } from 'vitest'
import * as fs from 'fs'
import { parse } from '../src/lib'

test('Parse PageType.json', () => {
  let schema = fs.readFileSync('test/schemas/PageType.json', 'utf8')
  let parsed = parse(schema)
  console.log(JSON.stringify(parsed, null, 2))
})

test('Evaluate PageType.json with empty object', () => {
  let schema = fs.readFileSync('test/schemas/PageType.json', 'utf8')
  let parsed = parse(schema)
  let properties = parsed.getProperties({})
  for (const property of properties) {
    console.log(property.debug())
  }
  let validationErrors = parsed.validate({})
  for (const error of validationErrors) {
    console.log(error)
  }
})


test('Evaluate PageType.json with Enum set to "Markdown"', () => {
  let schema = fs.readFileSync('test/schemas/PageType.json', 'utf8')
  let parsed = parse(schema)
  let properties = parsed.getProperties({ pageType: 'Markdown' })
  for (const property of properties) {
    console.log(property.debug())
  }
  let validationErrors = parsed.validate({ pageType: 'Markdown' })
  for (const error of validationErrors) {
    console.log(error)
  }
})
