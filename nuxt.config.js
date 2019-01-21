const pkg = require('./package')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    script: [],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: ['~/assets/style/app.styl'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/logger' },
    { src: '@/plugins/ipfs' },
    { src: '@/plugins/orbitdb' },
    { src: '@/plugins/node' },
    { src: '@/plugins/swarm' },
    { src: '@/plugins/vuetify' }
  ],

  router: {
    //middleware: ['database']
    //middleware: ['_test']
  },
  //serverMiddleware: ['~/middleware/_test-server'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '~/modules/logger',
    '~/modules/ipfs',
    '~/modules/orbitdb',
    '~/modules/node',
    '~/modules/swarm'
  ],
  /*
  
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      //Set server side object to empty on browser
      config.node = {
        fs: 'empty',
        child_process: 'empty'
      }
    }
  }
}
