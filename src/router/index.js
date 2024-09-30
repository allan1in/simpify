import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Layout.vue'
import NotFound from '@/views/NotFound.vue'
import Dashboard from '@/views/Dashboard/index.vue'
import LoginUser from '@/views/Login/index.vue'
import { useUserStore } from '@/stores/user'
import Search from '@/views/Search/index.vue'
import GetAll from '@/views/Search/views/GetAll.vue'
import GetTracks from '@/views/Search/views/GetTracks.vue'
import GetAlbums from '@/views/Search/views/GetAlbums.vue'
import GetArtists from '@/views/Search/views/GetArtists.vue'

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
          component: Search,
          name: 'Search',
          children: [
            {
              path: '',
              name: 'GetAll',
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
      next()
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
          next('/login')
        }
      }
    }
  }
})

export default router
