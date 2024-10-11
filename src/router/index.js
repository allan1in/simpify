import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import NotFound from '@/views/NotFound.vue'
import Dashboard from '@/views/Dashboard/index.vue'
import LoginUser from '@/views/Login/index.vue'
import { useUserStore } from '@/stores/user'
import Search from '@/views/Search/index.vue'
import GetAll from '@/views/Search/SearchResult/GetAll/index.vue'
import GetTracks from '@/views/Search/SearchResult/GetTracks/index.vue'
import GetAlbums from '@/views/Search/SearchResult/GetAlbums/index.vue'
import GetArtists from '@/views/Search/SearchResult/GetArtists/index.vue'
import SearchResult from '@/views/Search/SearchResult/index.vue'
import Track from '@/views/Track/index.vue'
import Album from '@/views/Album/index.vue'
import Artist from '@/views/Artist/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'search',
          children: [
            {
              path: '',
              name: 'Search',
              component: Search
            },
            {
              path: ':inputContent',
              component: SearchResult,
              children: [
                {
                  path: '',
                  name: 'SearchResult',
                  component: GetAll
                },
                {
                  path: 'tracks',
                  name: 'GetTracks',
                  component: GetTracks
                },
                {
                  path: 'albums',
                  name: 'GetAlbums',
                  component: GetAlbums
                },
                {
                  path: 'artists',
                  name: 'GetArtists',
                  component: GetArtists
                }
              ]
            }
          ]
        },
        {
          path: 'track/:trackId',
          name: 'Track',
          component: Track
        },
        {
          path: 'album/:albumId',
          name: 'Album',
          component: Album
        },
        {
          path: 'artist/:artistId',
          name: 'Artist',
          component: Artist
        }
      ]
    },
    {
      path: '/login',
      name: 'LoginUser',
      component: LoginUser
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (localStorage.getItem('access_token') === null) {
    // Has no token
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  } else {
    // Has token
    if (to.path === '/login') {
      // White list pages
      next('/')
    } else {
      let userStore = useUserStore()
      if (userStore.display_name) {
        // Has userData
        next()
      } else {
        // Has no userData
        try {
          await userStore.getUserData()
          next()
        } catch (error) {
          // Bad or expired token
          alert('Bad or expired token, please login again')

          window.localStorage.clear()
          next('/login')
        }
      }
    }
  }
})

export default router
