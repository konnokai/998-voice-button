import site from './assets/locales/site.json';
export default defineNuxtConfig({
  devServer: {
    port: 3333,
    host: '0.0.0.0',
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'vuetify-nuxt-module',
  ],
  build: {
    transpile: ['vuetify-sonner']
  },
  app: {
    head: {
      title: site.title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'keywords', name: 'keywords', content: site.keywords },
        { hid: 'description', name: 'description', content: site.description },
        { hid: 'og:site_name', property: 'og:site_name', content: site.title },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:url', property: 'og:url', content: site.title },
        { hid: 'og:title', property: 'og:title', content: site.title },
        { hid: 'og:description', property: 'og:description', content: site.description },
        { hid: 'og:image', property: 'og:image', content: site.social_image },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: site.twitter_user },
        { name: "theme-color", content: site.theme_color }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: "/icon.png" },
        { rel: 'shortcut icon', type: 'image/png', href: "/icon.png" }
      ]
    },
  },
})