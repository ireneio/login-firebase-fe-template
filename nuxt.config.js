export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'nuxt-ts-docker-template',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/scss/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~/plugins/axios'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  env: {
    API_URL: process.env.NUXT_ENV_API_URL || 'http://localhost:8081',
    BLOB_URL: process.env.NUXT_ENV_BLOB_URL || 'http://localhost:3000',
    TIMEOUT_LIMIT: process.env.NUXT_ENV_TIMEOUT_LIMIT,
    FB_APIKEY: process.env.NUXT_ENV_FB_APIKEY || 'AIzaSyDzwbn-tD8Ug4SmhqM5Nj5rDAHbqtOcpfk',
    FB_AUTHDOMAIN: process.env.NUXT_ENV_FB_AUTHDOMAIN || 'auth-service-template.firebaseapp.com',
    FB_DBURL: process.env.NUXT_ENV_FB_DBURL || '',
    FB_PROJECTID: process.env.NUXT_ENV_FB_PROJECTID || 'auth-service-template',
    FB_APPID: process.env.NUXT_ENV_FB_APPID || '1:757088030425:web:5bf05537026741bc4ff8c8'
  },
  ssr: false
}
