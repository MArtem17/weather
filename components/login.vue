<template>
    <v-card>
        <v-btn icon @click="$emit('closeLog')" style="position: absolute; right: 0;">
            <v-icon style="font-size: 40px;">mdi-close</v-icon>
        </v-btn>
        <v-form ref="form" v-model="valid" lazy-validation style="width: 40vw; padding: 10px 50px">
            <v-text-field v-model="login" :counter="15" :rules="loginRules" label="Логин" required>
            </v-text-field>
            <v-text-field :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules"
                :type="show ? 'text' : 'password'" label="Пароль" v-model="password" @click:append="show = !show" required>
            </v-text-field>
            <v-alert dense text type="success" v-if="loginSuccess">
                Вы успешно вошли
            </v-alert>
            <v-alert dense text type="error" v-if="loginErrorLogin">
                Пользователя с таким логином не существует
            </v-alert>
            <v-alert dense text type="error" v-if="loginErrorPassword">
                Неверный пароль
            </v-alert>
            <v-btn :disabled="!valid" color="orange" class="mr-4" @click.enter="logIn()">
                Войти
            </v-btn>
            <v-btn color="orange" class="mr-4" @click="$emit('openReg')">
                Зарегистрироваться
            </v-btn>
        </v-form>
    </v-card>
</template>

<script>
import axios from 'axios'
export default {
    data: () => ({
        valid: false,
        show: false,
        show1: false,
        loginSuccess: false,
        loginErrorLogin: false,
        loginErrorPassword: false,
        login: '',
        loginRules: [
            v => !!v || 'Придумайте название команды',
            v => (v && v.length <= 15) || 'Название команды не должно превышать 15 символов',
        ],
        password: '',
        passwordRules: [
            v => !!v || 'Придумайте пароль',
            v => (v && v.length <= 15 && v.length >= 4) || 'Длина пароля должна быть в диапозоне от 4 до 15 символов',
        ],
    }),
    methods: {
        async logIn() {
            if (this.$refs.form.validate()) {
                this.loginErrorLogin = false
                this.loginErrorPassword = false
                this.loginSuccess = false
                var hash = this.password.split("").reduce(function (a, b) {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0)
                await axios.get(`/api/user?&login=${this.login}&password=${hash}`).then((response) => {
                    if (response.data.user == 'данные не корректны') {
                        console.log("Error data")
                    } else if (response.data.user == 'Пользователя с таким логином не найдено') {
                        this.loginErrorLogin = true
                        this.login = ''
                        this.password = ''
                    } else if (response.data.user == 'Не правильный пароль') {
                        this.loginErrorPassword = true
                        this.password = ''
                    } else {
                        this.loginSuccess = true
                        sessionStorage.setItem('user', JSON.stringify(response.data.user))
                        setTimeout(() => { this.$emit('loginSuccess') }, 700)
                        // setTimeout(() => { this.$parent.loginSuccess() }, 700)
                    }
                })
                // }
            }
        },
    }
}
</script>