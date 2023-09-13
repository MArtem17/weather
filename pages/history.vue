<template>
    <client-only>
        <div v-if="loaded">
            <v-container>
                <v-card>
                    <v-card-title>
                        <v-row>
                            <v-col cols="8">
                                <h3>История запросов</h3>
                            </v-col>
                            <v-col cols="4">
                                <h3><v-btn @click="clearHistory()">Очистить всю историю</v-btn></h3>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-list>
                        <v-list-item v-for="(item, i) in history" :key="i">
                            {{ item.time }} пользователь {{ item.mode }} - просмотр погоды в городе {{ item.city }}
                            <template v-slot:append>
                                <v-icon icon="mdi-delete" @click="deleteHistoryItem(i)"></v-icon>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-container>
        </div>
    </client-only>
</template>

<script>
export default {
    data: () => ({
        history: [],
        loaded: false
    }),
    async beforeMount() {
        this.history = JSON.parse(localStorage.getItem('history'))
        this.loaded = true
    },
    methods: {
        deleteHistoryItem(i) {
            this.loaded = false
            this.history.splice(i, 1)
            localStorage.setItem('history', JSON.stringify(this.history))
            this.loaded = true
        },
        clearHistory() {
            localStorage.setItem('history', JSON.stringify([]))
            this.history = []
        }
    }
}
</script>