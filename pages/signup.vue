<template>
  <v-container>
    <h1>Sing up</h1>
    <v-text-field v-model="name" type="text" label="Name" />
    <v-text-field
      v-model="email"
      type="email"
      label="Email"
      :rules="rules.email"
    />
    <v-text-field
      v-model="password"
      type="password"
      label="Password"
      :rules="rules.password"
    />
    <v-text-field
      v-model="confirmPassword"
      type="password"
      label="Confirm Password"
      :rules="rules.confirmPassword"
    />
    <v-btn color="primary" @click="signup">
      Sign up
    </v-btn>
    <v-btn to="/login" color="primary">
      Cancel
    </v-btn>
    <div>{{ message }}</div>
  </v-container>
</template>

<script>
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth'
import { auth } from '../plugins/firebase'

export default {
  name: 'SignupPage',
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      message: '',
      rules: {
        email: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ],
        password: [
          v => !!v || 'Password is required',
          v => (v && v.match(/^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))([a-zA-Z0-9])+$/)) ||
              'Password must contain at least 1 upper case letter, 1 lower case letter, and 1 numeric character'
        ],
        confirmPassword: [
          v => (v === this.password) || 'Password does not match'
        ]
      }
    }
  },
  methods: {
    signup () {
      if (this.email.trim() && this.password.trim()) {
        if (this.password === this.confirmPassword) {
          createUserWithEmailAndPassword(auth, this.email, this.password)
            .then((userCrendtial) => {
              const user = userCrendtial.user
              updateProfile(user, { displayName: this.name })
                .then(() => {
                  const user = auth.currentUser
                  this.message = 'アカウントが作成されました :' + (user.displayName || user.uid)
                  this.$store.dispatch('setUser', {
                    uid: user.uid,
                    displayName: user.displayName
                  })
                  this.$router.push('/login')
                })
            })
            .catch((err) => {
              this.message = err.message
            })
        } else {
          this.message = 'パスワードが一致しません'
        }
      }
    }
  }
}
</script>

<style>

</style>
