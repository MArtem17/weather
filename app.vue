<template>
  <client-only>
    <v-app dark>
      <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i" :value="item" :to="item.to" router exact>
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar :clipped-left="clipped" fixed app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-btn v-if="!boolLog" @click="openWindowLogIn()">Войти</v-btn>
        <v-btn v-if="!boolLog" @click="openWindowRegistration()">Зарегистрироваться</v-btn>
        <v-btn v-if="boolLog" @click="logout()">Выйти</v-btn>
      </v-app-bar>
      <v-main>
        <div :class="{ opacity: (windowLogIn || windowRegistration) }">
          <NuxtPage />
        </div>
        <v-card v-if="windowRegistration" class="mx-auto" max-width="40vw"
          style="position: absolute; top: 200px; z-index: 1; right: 30vw">
          <registration @closeReg="closeWindowRegistration" @registrtionSuccess="registrationSuccess" />
        </v-card>
        <v-card v-if="windowLogIn" class="mx-auto" max-width="40vw"
          style="position: absolute; top: 200px; z-index: 1; right: 30vw">
          <login @closeLog="closeWindowLogIn" @openReg="(closeWindowLogIn, openWindowRegistration)"
            @loginSuccess="loginSuccess" />
        </v-card>
      </v-main>
      <v-footer :absolute="!fixed" app>
        <span>&copy; {{ new Date().getFullYear() }} - Макаров Артём Александрович</span>
      </v-footer>
    </v-app>
  </client-only>
</template>

<style>
.opacity {
  opacity: 0.3;
}
</style>

<script>
import registration from './components/registration.vue'
import login from './components/login.vue'
export default {
  components: { registration, login },
  name: 'DefaultLayout',
  data() {
    return {
      boolLog: false,
      clipped: true,
      drawer: false,
      fixed: true,
      items: [
        { title: 'Погода', icon: 'mdi-cloud-outline', to: '/' },
        { title: 'История', icon: 'mdi-history', to: '/history' },
      ],
      miniVariant: false,
      right: true,
      title: 'Сервис погоды',
      windowLogIn: false,
      windowRegistration: false
    }
  },
  async beforeMount() {
    if (JSON.parse(sessionStorage.getItem('user'))) {
      this.boolLog = true
    }
  },
  methods: {
    closeWindowRegistration() {
      this.windowRegistration = false
    },
    closeWindowLogIn() {
      this.windowLogIn = false
    },
    openWindowRegistration() {
      this.windowRegistration = true
    },
    openWindowLogIn() {
      this.windowLogIn = true
    },
    logout() {
      sessionStorage.removeItem('user')
      window.dispatchEvent(new CustomEvent('update-sessionstorage', { detail: { storage: [], login: false } }))
      this.boolLog = false
    },
    loginSuccess() {
      this.closeWindowLogIn()
      window.dispatchEvent(new CustomEvent('update-sessionstorage', { detail: { storage: JSON.parse(sessionStorage.getItem('user')).favorites, login: true } }))
      this.boolLog = true
    },
    registrationSuccess() {
      this.closeWindowRegistration()
      window.dispatchEvent(new CustomEvent('update-sessionstorage', { detail: { storage: JSON.parse(sessionStorage.getItem('user')).favorites, login: true } }))
      this.boolLog = true
    }
  }
}
</script>