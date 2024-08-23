import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // We turned this off, as the current code state does enforce any types
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  {
    ignores: ['out/', 'build/', 'public/', '.next/'],
  }
);
