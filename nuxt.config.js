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
    { src: '@/plugins/vuetify' },
    { src: '@/plugins/logger', ssr: false },
    { src: '@/plugins/ipfs', ssr: false },
    { src: '@/plugins/message', ssr: false },
    { src: '@/plugins/orbitdb', ssr: false },
    { src: '@/plugins/swarm', ssr: false },
    { src: '@/plugins/node', ssr: false }
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
    '~/modules/signaling',
    '~/modules/ipfs',
    '~/modules/message',
    '~/modules/orbitdb',
    '~/modules/swarm',
    '~/modules/node'
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
        child_process: 'empty',
        dgram: 'empty',
        net: 'empty'
      }
    }
  }
}
