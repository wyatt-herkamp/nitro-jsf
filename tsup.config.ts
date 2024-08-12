import { defineConfig } from 'tsup'

const config = {
  entry: ['src/lib.ts'],
  dts: true,
  minify: true,
  treeshake: true
}

export default defineConfig([
  {
    ...config,
    format: ['esm']
  },
  {
    ...config,
    format: ['cjs'],
    noExternal: ['chevrotain']
  }
])
