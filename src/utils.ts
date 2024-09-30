export function isHttpDefinition(schema: string): boolean {
  return schema.startsWith('http') || schema.startsWith('https')
}
