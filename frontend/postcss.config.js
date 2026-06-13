import purgecss from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    purgecss({
      content: [
        './index.html',
        './src/**/*.jsx',
        './src/**/*.js'
      ],
      safelist: {
        standard: [
          'html', 'body', 'fade', 'show', 'collapse', 'collapsing',
          /^navbar/, /^nav-/, /^modal/, /^btn-/
        ]
      },
      variables: true
    })
  ]
};