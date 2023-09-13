<template>
    <v-card class="mx-auto" max-width="368">
        <v-card-title>{{ dateset }}</v-card-title>
        <v-card-item>
            <template v-slot:subtitle>
                <span v-if="weather.length == 8">{{ weather[4].weather_description }}</span>
                <span v-else>{{ weather[0].weather_description }}</span>
            </template>
        </v-card-item>

        <v-card-text class="py-0">
            <v-row align="center" no-gutters>
                <v-col v-if="weather.length == 8" class="text-h5" cols="8">
                    {{ weather[4].temp }}&deg;С
                </v-col>
                <v-col v-else class="text-h5" cols="8">
                    {{ weather[0].temp }}&deg;С
                </v-col>

                <v-col cols="4" class="text-right">
                    <v-icon v-if="weather.length == 8" :icon="weather[4].icon" size="40"></v-icon>
                    <v-icon v-else :icon="weather[0].icon" size="40"></v-icon>
                </v-col>
            </v-row>
        </v-card-text>

        <div class="py-3 justify-space-between">
            <v-list-item density="compact" prepend-icon="mdi-weather-windy">
                <v-list-item-subtitle v-if="weather.length == 8">{{ weather[4].wind_speed }} м/с</v-list-item-subtitle>
                <v-list-item-subtitle v-else>{{ weather[0].wind_speed }} м/с</v-list-item-subtitle>
            </v-list-item>

            <v-list-item density="compact" prepend-icon="mdi-weather-pouring">
                <v-list-item-subtitle v-if="weather.length == 8">{{ weather[4].pop }}%</v-list-item-subtitle>
                <v-list-item-subtitle v-else>{{ weather[0].pop }}%</v-list-item-subtitle>
            </v-list-item>
        </div>

        <v-expand-transition>
            <div v-if="expand">
                <v-list class="bg-transparent">
                    <v-list-item v-for="(item, i) in weather" :key="i" :title="timeset(i)" :append-icon="item.icon">
                        <v-list-item-subtitle>{{ item.temp }}&deg;С</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </div>
        </v-expand-transition>

        <v-divider></v-divider>

        <v-card-actions>
            <v-btn @click="expand = !expand">
                {{ !expand ? 'Подробнее' : 'Свернуть' }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        weather: Array
    },
    data: () => ({
        expand: false,
    }),
    computed: {
        dateset() {
            var arr = this.weather[0].date_time.split(' ')
            var date = arr[0].split('-')
            return date[2] + "." + date[1]
        },
    },
    methods: {
        timeset(i) {
            var arr = this.weather[i].date_time.split(' ')
            var time = arr[1].split(':')
            return time[0] + "." + time[1]
        }
    }
}
</script>