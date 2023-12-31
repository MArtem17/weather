import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from 'vuetify/lib/util/colors'
export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        locale: {
            fallback: "ru", // локаль если нужны переключения языков
        },
        theme: {
            defaultTheme: 'dark',
            dark: {
                primary: colors.blue.darken2,
                accent: colors.grey.darken3,
                secondary: colors.amber.darken3,
                info: colors.teal.lighten1,
                warning: colors.amber.base,
                error: colors.deepOrange.accent4,
                success: colors.green.accent3
            }
            // тут кастомные темы
        },
        // components: {
        //     VApp, // тут компоненты вьютифая
        // },
        ssr: true, // nuxt 3 - ssr
        components,
        directives
    });

    nuxtApp.vueApp.use(vuetify);
});