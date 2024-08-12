import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules/*', 'dist/**/*'],
  },
  {
    rules:{
      "@typescript-eslint/no-explicit-any": "off",
    }
  },
];