const pkg = require('./package')

module.exports = {
  mode: 'universal',
  debug: true,

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
    script: [
      { src: '/orbitdb.js' },
      { src: 'https://unpkg.com/ipfs/dist/index.min.js' }
    ],
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
    { src: '@/plugins/node' } //,
    //{ src: '@/plugins/user', ssr: false }
    //{ src: '@/plugins/database', ssr: false }
  ],

  router: {
    //middleware: ['database']
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    '~/modules/node' //,
    //'~/modules/node',
    //'~/modules/swarm'
    // Doc: https://github.com/nuxt-community/axios-module#usage
    //'@nuxtjs/axios'/*,
    //'~/modules/database'*/
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
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
    }
  }
}
