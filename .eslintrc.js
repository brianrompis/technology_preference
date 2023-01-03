module.exports = {
  root: true,
  extends: [
    '@indielayer/eslint-config-vue'
  ],
  rules: {
    'vue/html-indent': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'eqeqeq': 'off',
    "arrow-parens": ["error", "as-needed"],
  }
}
