import * as fs from 'fs'
import { parseJsonSchema } from '../src/lib.js'
test('Parse EnumSchemaAdjacentTest.json', () => {
  const schema = fs.readFileSync('test/schemas/enums/EnumSchemaAdjacentTest.json', 'utf8')
  const parsed = parseJsonSchema(schema)
  console.log(JSON.stringify(parsed, null, 2))
})

test('Evaluate EnumSchemaAdjacentTest.json', () => {
  const schema = fs.readFileSync('test/schemas/enums/EnumSchemaAdjacentTest.json', 'utf8')
  const parsed = parseJsonSchema(schema)
  const properties = parsed.getProperties({})
  for (const property of properties) {
    console.log(property.debug())
  }
  const validationErrors = parsed.validate({})
  for (const error of validationErrors) {
    console.log(error)
  }
  {
    const validationErrors = parsed.validate({
      type: 'A',
      data: 1
    })
    for (const error of validationErrors) {
      console.log(error)
    }
  }
})
