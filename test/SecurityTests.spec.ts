import * as fs from 'fs'
import { parse } from '../src/lib'

test('Parse Security.json', () => {
    let schema = fs.readFileSync('test/schemas/Security.json', 'utf8')
    let parsed = parse(schema)
    console.log(JSON.stringify(parsed, null, 2))
});
test('Evaluate Security.json with empty object', () => {
    let schema = fs.readFileSync('test/schemas/Security.json', 'utf8')
    let parsed = parse(schema)
    let properties = parsed.getProperties({})
    for (const property of properties) {
        console.log(property.debug())
    }
    let validationErrors = parsed.validate({})
    for (const error of validationErrors) {
        console.log(error)
    }
});