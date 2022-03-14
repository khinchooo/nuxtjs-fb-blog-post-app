<template>
  <v-form @submit.prevent="updateBlog">
    <v-row>
      <v-container>
        <h1>Edit Post</h1>
        <v-col cols="12" md="6">
          <v-text-field v-model="blog.title" label="Title" />
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea
            v-model="blog.content"
            filled
            label="Content"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-btn type="submit" color="primary">
            Update
          </v-btn>
        </v-col>
      </v-container>
    </v-row>
  </v-form>
</template>

<script>
import { doc, getDoc, serverTimestamp, updateDoc } from '@firebase/firestore'
import { db } from '~/plugins/firebase'

export default {
  name: 'EditPage',
  // middleware: 'authenticated',
  asyncData ({ params }) {
    const id = params.id
    return { id }
  },
  data () {
    return {
      blog: {
        title: '',
        content: '',
        created_at: ''
      }
    }
  },
  async mounted () {
    await this.getBlog()
  },
  methods: {
    async getBlog () {
      const usersCollectionRef = doc(db, 'blogs', this.id)
      const docSnap = await getDoc(usersCollectionRef)
      if (docSnap.exists()) {
        this.blog = docSnap.data()
      }
    },
    async updateBlog () {
      const usersCollectionRef = doc(db, 'blogs', this.id)
      const docSnap = await updateDoc(usersCollectionRef, {
        title: this.blog.title,
        content: this.blog.content,
        updated_at: serverTimestamp()
      })
      this.$router.push('/')
      return docSnap
    }
  }
}
</script>

<style>

</style>
