<template>
    <client-only>
        <div style="position: relative; width: 100%; height: 100%;">
            <v-row style="height: 92vh;">
                <v-col cols="12" md="3" style="background-color: grey; padding: 20px;">
                    <h3 class="text-center">Введите название города или выберите из списка городов, которые Вы ранее
                        добавили в
                        избранное</h3>
                    <v-card color="grey-darken-3" max-width="400" style="margin: 50px auto;">
                        <v-card-text>
                            <v-text-field :loading="loading" density="compact" variant="solo" label="Введите город"
                                append-inner-icon="mdi-magnify" prepend-inner-icon="mdi-star-outline" v-model="city"
                                single-line hide-details @click:append-inner="searchWeather(city)"
                                @click:prepend-inner="addCityFavorite(city)"></v-text-field>
                        </v-card-text>
                    </v-card>
                    <v-alert dense text type="error" v-if="alert">
                        Для не авторизованного пользователя доступно только 15 запросов в час. Авторизуйтесь, чтобы
                        продолжить сейчас, или подождите час, чтобы продолжить без авторизации.
                    </v-alert>
                    <v-card class="mx-auto pa-2" max-width="400">
                        <v-list v-if="login">
                            <v-list-subheader>Избранное:</v-list-subheader>
                            <div v-if="favorites.length">
                                <v-list-item v-for="(item, i) in favorites" :key="i" :value="item" rounded="xl">
                                    <v-list-item-title>{{ item }}</v-list-item-title>
                                    <template v-slot:prepend>
                                        <v-icon icon="mdi-magnify" @click="searchWeather(item)"></v-icon>
                                    </template>
                                    <template v-slot:append>
                                        <v-icon icon="mdi-delete" @click="removeCityFavorite(item)"></v-icon>
                                    </template>
                                </v-list-item>
                            </div>
                        </v-list>
                        <v-alert dense text type="warning" v-else>
                            Авторизуйтесь чтобы использовать список "Избранное"
                        </v-alert>

                    </v-card>
                </v-col>
                <v-col cols="12" md="9" style="padding-top: 50px;">
                    <v-row v-if="loaded && weather.length">
                        <v-col cols="0" lg="1"></v-col>
                        <v-col v-for="(item, i) in weather" :key="i" cols="12" sm="4" lg="2">
                            <WeatherCard :weather="weather[i]" />
                        </v-col>
                        <v-col cols="0" lg="1"></v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </client-only>
</template>

<script>
import axios from 'axios'
import weatherCard from '~/components/weatherCard.vue'
export default {
    components: { weatherCard },
    data: () => ({
        loaded: false,
        loading: false,
        city: "",
        info: null,
        res: [],
        weather: [],
        favorites: [],
        login: false,
        alert: false
    }),
    mounted() {
        window.addEventListener('update-sessionstorage', (event) => {
            this.favorites = event.detail.storage
            this.login = event.detail.login
            if (this.login) {
                this.alert = false
            }
        })
    },
    async beforeMount() {
        if (JSON.parse(sessionStorage.getItem('user'))) {
            this.login = true
            this.favorites = JSON.parse(sessionStorage.getItem('user')).favorites
        }
    },
    methods: {
        async searchWeather(city) {
            this.loading = true
            if (city)
                await axios
                    .get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=4a7da37b8a1cddc50b5fe5df0b8508fe`)
                    .then(response => (this.info = response.data[0]));
            if (!this.info) {
                this.city = ''
                this.loading = false
            } else {

                await axios
                    .get(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.info.lat}&lon=${this.info.lon}&units=metric&lang=ru&appid=95dd9780b4e2f322c264186c465ae63e`)
                    .then(response => (this.res = response.data.list));
                this.weather = []
                var temp = []
                var weather = []
                var icon = ''
                for (let i = 0; i < this.res.length; i++) {
                    switch (this.res[i].weather[0].main) {
                        case 'Clear':
                            icon = 'mdi-white-balance-sunny'
                            break
                        case 'Clouds':
                            icon = 'mdi-weather-cloudy'
                            break
                        case 'Thunderstorm':
                            icon = 'mdi-weather-lightning-rainy'
                            break
                        case 'Drizzle':
                            icon = 'mdi-weather-rainy'
                            break
                        case 'Rain':
                            icon = 'mdi-weather-pouring'
                            break
                        case 'Snow':
                            icon = 'mdi-snowflake'
                            break
                        default:
                            icon = 'mdi-weather-cloudy-alert'
                            break
                    }
                    var item = {
                        temp: Math.round(this.res[i].main.temp),
                        weather_description: this.res[i].weather[0].description,
                        icon: icon,
                        clouds: this.res[i].clouds.all,
                        wind_speed: Math.round(this.res[i].wind.speed),
                        wind_gust: Math.round(this.res[i].wind.gust),
                        pop: Math.round(this.res[i].pop * 100),
                        date_time: this.res[i].dt_txt
                    }
                    if (i == 0) {
                        temp.push(item)
                    } else {
                        var data_one = this.res[i - 1].dt_txt.split(' ')
                        var data_two = this.res[i].dt_txt.split(' ')
                        if (data_one[0] == data_two[0]) {
                            temp.push(item)
                        } else {
                            weather.push(temp)
                            temp = []
                            temp.push(item)
                        }
                    }
                }
                if (!this.login) {
                    var logoutReq = []
                    if (JSON.parse(localStorage.getItem('logoutReq'))) {
                        logoutReq = JSON.parse(localStorage.getItem('logoutReq'))
                    }
                    var date = +new Date
                    if (logoutReq.length < 15) {
                        logoutReq.push(date)
                        localStorage.setItem('logoutReq', JSON.stringify(logoutReq))
                        this.addItemHistory(city)
                        this.weather = [...weather]
                    } else {
                        var flag = true
                        while (flag) {
                            console.log(date, logoutReq[0], date - logoutReq[0])
                            if ((date - logoutReq[0]) > 3600000) {
                                logoutReq.shift()
                            } else {
                                flag = false
                            }
                        }
                        if (logoutReq.length < 15) {
                            logoutReq.push(date)
                            localStorage.setItem('logoutReq', JSON.stringify(logoutReq))
                            this.addItemHistory(city)
                            this.weather = [...weather]
                        } else {
                            this.alert = true
                        }
                    }
                } else {
                    this.addItemHistory(city)
                    this.weather = [...weather]
                }
                this.loading = false
                this.loaded = true
            }
        },
        addItemHistory(city) {
            var history = []
            if (JSON.parse(localStorage.getItem('history'))) {
                history = JSON.parse(localStorage.getItem('history'))
            }
            var time = new Date().toLocaleTimeString()
            const itemHistory = {
                time: time,
                city: city,
                mode: this.login ? JSON.parse(sessionStorage.getItem('user')).login : "Гость"
            }
            history.unshift(itemHistory)
            localStorage.setItem('history', JSON.stringify(history))
        },
        async addCityFavorite(city) {
            if (city)
                await axios
                    .get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=4a7da37b8a1cddc50b5fe5df0b8508fe`)
                    .then(response => (this.info = response.data[0]));
            if (!this.info) {
                this.city = ''
                this.loading = false
            } else {
                await axios.put(`/api/user?&mode=add&city=${city}&id=${JSON.parse(sessionStorage.getItem('user')).id}`).then((response) => {
                    if (response.data.user == 'данные не корректны') {
                        console.log("Error data")
                    } else if (response.data.user == 'Пользователя с таким логином не найдено') {
                        console.log("Пользователь не найден")
                    } else if (response.data.user == 'Город уже в избранном') {
                        console.log("Город уже в избранном")
                    } else {
                        sessionStorage.setItem('user', JSON.stringify(response.data.user))
                        this.favorites = response.data.user.favorites
                        // setTimeout(() => { this.$parent.loginSuccess() }, 700)
                    }
                })
            }
        },
        async removeCityFavorite(city) {
            await axios.put(`/api/user?&mode=remove&city=${city}&id=${JSON.parse(sessionStorage.getItem('user')).id}`).then((response) => {
                if (response.data.user == 'данные не корректны') {
                    console.log("Error data")
                } else if (response.data.user == 'Пользователя с таким логином не найдено') {
                    console.log("Пользователь не найден")
                } else if (response.data.user == 'Город не найден в избранном') {
                    console.log("Город не найден в избранном")
                } else {
                    sessionStorage.setItem('user', JSON.stringify(response.data.user))
                    this.favorites = response.data.user.favorites
                    // setTimeout(() => { this.$parent.loginSuccess() }, 700)
                }
            })
        }
    },
}
</script>