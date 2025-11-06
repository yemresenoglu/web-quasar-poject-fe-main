import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-webpack/eslint'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    rules: {
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['Home', 'Login', 'Header', 'Sidebar', 'Tab'],
        },
      ],
    },
  },

  ...pluginQuasar.configs.recommended(),
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
        ga: 'readonly',
      },
    },

    rules: {
      'prefer-promise-reject-errors': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'template-curly-spacing': 'error',
      'arrow-spacing': 'error',
      'comma-dangle': ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          ignores: ['router-view', 'router-link', 'transition', 'transition-group'],
        },
      ],
      'vue/attribute-hyphenation': 'error',
      'vue/component-definition-name-casing': 'error',
      'vue/first-attribute-linebreak': 'error',
      'vue/html-closing-bracket-newline': 'error',
      'vue/html-indent': ['error', 2],
      'vue/html-quotes': ['error', 'double'],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
          multiline: 1,
        },
      ],
      'vue/multiline-html-element-content-newline': 'error',
      'vue/mustache-interpolation-spacing': 'error',
      'vue/no-multi-spaces': 'error',
      'vue/no-spaces-around-equal-signs-in-attribute': 'error',
      'vue/no-template-shadow': 'error',
      'vue/prop-name-casing': 'error',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'warn',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/v-bind-style': 'error',
      'vue/v-on-style': 'error',
      'vue/v-slot-style': 'error',
    },
  },

  prettierSkipFormatting,
]
