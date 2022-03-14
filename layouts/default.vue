<template>
  <v-app>
    <v-app-bar color="blue-grey lighten-5" fixed app>
      <v-toolbar-title class="px-3 headline font-weight-medium font-italic light-blue--text">
        My Blog Post
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              large
              icon
              color="primary"
              dark
              v-bind="attrs"
              to="/"
              v-on="on"
            >
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </template>
          <span>Home</span>
        </v-tooltip>
        <v-toolbar-title v-if="user" class="my-5 body-1 primary--text blue-grey lighten-3 rounded-lg">
          {{ user.displayName || user.uid }}
        </v-toolbar-title>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              v-if="user"
              large
              icon
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
              @click="logout"
            >
              <v-icon>mdi-logout</v-icon>
            </v-btn>
            <v-btn
              v-else
              large
              icon
              color="primary"
              dark
              v-bind="attrs"
              to="/login"
              v-on="on"
            >
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <span v-if="user">Logout</span>
          <span v-else>Login</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              v-if="!user"
              large
              icon
              color="primary"
              dark
              v-bind="attrs"
              to="/signup"
              v-on="on"
            >
              <v-icon>mdi-account-group-outline</v-icon>
            </v-btn>
          </template>
          <span>Signup</span>
        </v-tooltip>
      </v-toolbar-items>
    </v-app-bar>
    <v-container>
      <v-main />
      <Nuxt />
    </v-container>
    <v-footer elevation="10" color="blue-grey lighten-5" app>
      <v-col class="font-weight-medium font-italic text-center primary--text" cols="12">
        &copy; Cybermissions {{ new Date().getFullYear() }}
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import { signOut } from 'firebase/auth'
import { auth } from '~/plugins/firebase'

export default {
  name: 'DefaultLayout',
  // middleware: 'authenticated',
  data () {
    return {
      search: ''
    }
  },
  computed: {
    // isAuthenticated () {
    //   return this.$store.getters.isAuthenticated
    // }
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    logout () {
      signOut(auth).then(() => {
        // this.$store.dispatch('reset')
        this.$store.dispatch('setUser', null)
      })
      // this.$router.push('/')
      window.location.href = '/'
    }
  }
}
</script>
