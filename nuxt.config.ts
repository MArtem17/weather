// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    "vuetify/lib/styles/main.css",
    "mdi/css/materialdesignicons.min.css", // если нужны mdi
  ],

  build: {
    transpile: ["vuetify"],
  },
  components: [
    '~/components'
  ]
})
