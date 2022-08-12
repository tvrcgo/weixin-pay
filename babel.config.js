module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript',
    'power-assert'
  ],
  plugins: [
    ['module-resolver', {
      root: ['.'],
      alias: {
        '@': './src'
      }
    }]
  ]
}
