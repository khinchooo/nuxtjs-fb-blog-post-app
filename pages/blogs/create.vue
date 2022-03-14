<template>
  <v-form @submit.prevent="add">
    <v-row>
      <v-container>
        <h1>Create Post</h1>
        <v-col cols="12" md="6">
          <v-text-field v-model="title" label="Title" />
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea
            v-model="content"
            filled
            label="Content"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-btn type="submit" color="primary">
            Create
          </v-btn>
        </v-col>
      </v-container>
    </v-row>
  </v-form>
</template>

<script>
import { addDoc, collection, serverTimestamp } from '@firebase/firestore'
import { db } from '~/plugins/firebase'
const usersCollectionRef = collection(db, 'blogs')

export default {
  name: 'BlogCreatePage',
  middleware: 'authenticated',
  data () {
    return {
      title: '',
      content: '',
      user_id: '',
      user_name: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },

  methods: {
    add () {
      if (this.title.trim() && this.content.trim()) {
        addDoc(usersCollectionRef, {
          user_id: this.user.uid,
          user_name: this.user.displayName,
          title: this.title,
          content: this.content,
          created_at: serverTimestamp()
        }).then(() => {
          this.user_id = ''
          this.title = ''
          this.content = ''
        })
      }
      this.$router.push('/')
    }
  }
}
</script>
