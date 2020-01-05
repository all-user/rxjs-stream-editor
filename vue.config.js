const projectStylusPlugin = require('./stylus.js');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/rxjs-stream-editor/'
    : '/',
  chainWebpack: config => {
    ['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(oneOf => {
      config.module
        .rule('stylus')
        .oneOf(oneOf)
        .use('stylus-loader')
          .tap(options => {
            options.use = options.use || []
            options.use.push(projectStylusPlugin())
            return options
          })
    })
  }
}
