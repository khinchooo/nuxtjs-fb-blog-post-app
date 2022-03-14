<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <h1>{{ blog.title }}</h1>
      </v-col>
      <v-col cols="12" md="8">
        {{ blog.created_at }}
      </v-col>
      <v-col cols="12" md="8">
        {{ blog.content }}
      </v-col>
      <v-col cols="12" md="8">
        Comments:
      </v-col>
      <v-col cols="12">
        <v-textarea v-model="comment" solo label="Comment" />
      </v-col>
      <v-col cols="12">
        <v-btn @click="addComment">
          Add Comment
        </v-btn>
      </v-col>
      <v-col cols="12" md="8">
        Comment Lists:
      </v-col>
      <v-col v-for="cmt in comments" :key="cmt.id" cols="12">
        <div class="text-h5">
          {{ cmt.comment }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>>

<script>
import { doc, getDoc, addDoc, collection, onSnapshot, deleteDoc, serverTimestamp } from '@firebase/firestore'
import { db } from '~/plugins/firebase'
const commentsCollectionRef = collection(db, 'comments')

export default {
  name: 'BlogDetail',
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
      },
      comments: [],
      comment: '',
      blog_id: '',
      show: false
    }
  },
  async mounted () {
    await this.getBlog()
    onSnapshot(commentsCollectionRef, (querySnapshot) => {
      this.blogs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    })
    onSnapshot(commentsCollectionRef, (querySnapshot) => {
      this.comments = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    })
  },
  methods: {
    async getBlog () {
      const blogsCollectionRef = doc(db, 'blogs', this.id)
      const docSnap = await getDoc(blogsCollectionRef)
      if (docSnap.exists()) {
        this.blog = docSnap.data()
        this.blog.created_at = this.$dateFns.format(this.blog.created_at.toDate(), 'yyyy-MM-dd HH:mm')
      }
    },
    addComment () {
      if (this.comment.trim()) {
        addDoc(commentsCollectionRef, {
          comment: this.comment,
          blog_id: doc(db, 'blogs', this.id),
          created_at: serverTimestamp()
        }).then(() => {
          this.comment = ''
        })
      }
    },
    remove (id) {
      const commentDocumentdoc = doc(db, 'comment', id)
      deleteDoc(commentDocumentdoc)
    }
  }
}
</script>
