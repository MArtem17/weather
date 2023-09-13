<template>
    <div>
        <v-btn icon @click="$emit('closeReg')" style="position: absolute; right: 0;">
            <v-icon style="font-size: 40px;">mdi-close</v-icon>
        </v-btn>
        <v-form ref="form" v-model="valid" lazy-validation style="width: 40vw; padding: 10px 50px">
            <v-text-field v-model="login" :counter="15" :rules="loginRules" label="Логин" required clearable>
            </v-text-field>

            <v-text-field :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules"
                :type="show ? 'text' : 'password'" label="Пароль" v-model="password" @click:append="show = !show" required
                clearable>
            </v-text-field>

            <v-text-field v-if="password && password.length >= 4 && password.length <= 15"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="passwordRules1" :type="show1 ? 'text' : 'password'"
                label="Подтвердите пароль" v-model="password1" @click:append="show1 = !show1" required clearable>
            </v-text-field>
            <v-alert dense text type="success" v-if="registrationSuccess">
                Вы успешно зарегестрировались
            </v-alert>
            <v-alert dense text type="error" v-if="registrationErrorPassword">
                Введенные пароли не совпадают
            </v-alert>
            <v-alert dense text type="error" v-if="registrationErrorLogin">
                Этот логин уже занят
            </v-alert>
            <v-btn :disabled="!valid" color="orange" class="mr-4" @click="registration()">
                Зарегистрироваться
            </v-btn>
        </v-form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data: () => ({
        valid: false,
        show: false,
        show1: false,
        registrationSuccess: false,
        registrationErrorLogin: false,
        registrationErrorPassword: false,
        login: '',
        loginRules: [
            v => !!v || 'Придумайте название команды',
            v => (v && v.length <= 15) || 'Название команды не должно превышать 15 символов',
        ],
        password: '',
        password1: '',
        passwordRules: [
            v => !!v || 'Придумайте пароль',
            v => (v && v.length <= 15 && v.length >= 4) || 'Длина пароля должна быть в диапозоне от 4 до 15 символов',
        ],
        passwordRules1: [
            v => !!v || 'Введите пароль еще раз',
            v => (v && v.length <= 15 && v.length >= 4) || 'Длина пароля должна быть в диапозоне от 4 до 15 символов',
        ],
    }),
    methods: {
        async registration() {
            if (this.$refs.form.validate()) {
                this.registrationErrorLogin = false
                this.registrationErrorPassword = false
                this.registrationSuccess = false
                if (this.password != this.password1) {
                    this.registrationErrorPassword = true
                    this.password = ''
                    this.password1 = ''
                } else {
                    var hash = this.password.split("").reduce(function (a, b) {
                        a = ((a << 5) - a) + b.charCodeAt(0);
                        return a & a;
                    }, 0)
                    var hash1 = this.password1.split("").reduce(function (a, b) {
                        a = ((a << 5) - a) + b.charCodeAt(0);
                        return a & a;
                    }, 0)
                    const user = {
                        login: this.login,
                        password: hash,
                        password1: hash1
                    }
                    await axios.post('/api/user', user).then((response) => {
                        if (response.data.user == 'данные не корректны') {
                            console.log("Error data")
                        } else if (response.data.user == 'этот логин занят') {
                            this.registrationErrorLogin = true
                            this.login = ''
                            this.password = ''
                            this.password1 = ''
                        } else {
                            this.registrationSuccess = true
                            sessionStorage.setItem('user', JSON.stringify(response.data.user))
                            setTimeout(() => { this.$emit('registrationSuccess') }, 700)
                        }
                    })
                }
            }
        },
    }
}
</script>