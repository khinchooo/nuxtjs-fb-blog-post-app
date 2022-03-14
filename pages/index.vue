<template>
  <v-container>
    <v-row>
      <v-col cols="10">
        <v-text-field
          v-model="search"
          label="Search..."
        />
      </v-col>
      <v-col cols="2">
        <v-btn icon @click="filteredList">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-fab-transition>
          <v-btn
            color="primary darken-2"
            dark
            absolute
            x-large
            bottom
            right
            fab
            class="my-16"
            to="/blogs/create"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-col>
    </v-row>
    <v-card
      max-width="700"
      class="mx-auto"
    >
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-card
              v-for="blog in displayBlogLists"
              :key="blog.id"
              color="lime lighten-5"
              class="my-1"
            >
              <v-card-title class="text-h6">
                {{ blog.title }}
                <v-spacer />
                Blogger: {{ blog.user_name }}
              </v-card-title>

              <v-card-subtitle v-if="blog.created_at" class="font-weight-medium subtitle-1">
                {{ $dateFns.format(blog.created_at.toDate(), 'yyyy-MM-dd HH:mm') }}
              </v-card-subtitle>
              <v-card-text>
                <div v-if="blog.content" class="d-inline-block text-truncate text-width">
                  {{ blog.content }}
                </div>
              </v-card-text>
              <v-card-actions class="py-0">
                <v-spacer />
                <v-btn
                  icon
                  @click="show = !show"
                >
                  <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-card-actions>
              <v-card v-show="show">
                <v-card-title>Comments</v-card-title>
                <ul v-for="com in comments" :key="com.id">
                  <div v-if="blog.id === com.blog_id.id">
                    <li>
                      {{ com.comment }}
                      <v-btn icon @click="commentDelete(com.id)">
                        <v-icon small color="red">
                          mdi-delete
                        </v-icon>
                      </v-btn>
                    </li>
                  </div>
                </ul>
              </v-card>
              <v-divider />
              <v-card-actions>
                <!-- <v-btn icon :to="{ path: `blogs/${blog.id}` }"> -->
                <v-btn :to="{ name: 'comment', query: { id: blog.id }}">
                  <v-icon small color="blue darken-2">
                    mdi-message-text
                  </v-icon>
                </v-btn>
                <v-btn icon :to="{ path: `blogs/${blog.id}/edit` }">
                  <v-icon small color="green lighten-2">
                    mdi-book-edit
                  </v-icon>
                </v-btn>
                <v-spacer />
                <v-btn icon @click="remove(blog.id)">
                  <v-icon small color="red">
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-pagination
              v-model="page"
              :length="length"
              @input="pageChange"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { collection, doc, deleteDoc, onSnapshot, query, orderBy } from '@firebase/firestore'
import { db } from '~/plugins/firebase'
const blogsCollectionRef = collection(db, 'blogs')
const q = query(blogsCollectionRef, orderBy('created_at', 'desc'))
const commentsCollectionRef = collection(db, 'comments')
// const commentRef = doc(db, 'comments', this.$route.id)
// const blogRef = doc(db, 'blogs', this.id)
// const qu = query(commentsCollectionRef, where('blogRef', '==', commentRef))

export default {
  name: 'IndexPage',
  filters: {
    truncate (text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + suffix
      } else {
        return text
      }
    }
  },
  data () {
    return {
      blogs: [],
      displayBlogLists: [],
      page: 1,
      pageSize: 3,
      search: '',
      show: false,
      comments: []
    }
  },
  computed: {
    length () {
      return Math.ceil(this.blogs.length / this.pageSize)
    }
  },
  mounted () {
    onSnapshot(commentsCollectionRef, (querySnapshot) => {
      this.comments = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    })
    const unsub = onSnapshot(q, (querySnapshot) => {
      this.blogs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      this.displayBlogLists = this.blogs.slice(0, this.pageSize)
    })
    return unsub
  },
  methods: {
    remove (id) {
      const userDocumentdoc = doc(db, 'blogs', id)
      deleteDoc(userDocumentdoc)
    },
    pageChange (pageNumber) {
      this.displayBlogLists = this.blogs.slice(this.pageSize * (pageNumber - 1), this.pageSize * (pageNumber))
    },
    filteredList () {
      this.displayBlogLists = this.blogs.filter((blog) => {
        return blog.title.toLowerCase().includes(this.search.toLowerCase()) || blog.content.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    commentDelete (id) {
      const cmtDocumentdoc = doc(db, 'comments', id)
      deleteDoc(cmtDocumentdoc)
    }
  }

}
</script>

<style scoped>
.text-width {
  max-width: 620px;
}
.text-comment {
  max-width: 300px;
}
/*.truncate {
  width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}*/
</style>
