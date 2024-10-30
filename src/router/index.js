import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import NotFound from '@/views/NotFound.vue'
import Dashboard from '@/views/Dashboard/index.vue'
import Login from '@/views/Login/index.vue'
import { useUserStore } from '@/stores/user'
import Search from '@/views/Search/index.vue'
import GetAll from '@/views/Search/SearchResult/GetAll/index.vue'
import GetTracks from '@/views/Search/SearchResult/GetTracks/index.vue'
import GetAlbums from '@/views/Search/SearchResult/GetAlbums/index.vue'
import GetArtists from '@/views/Search/SearchResult/GetArtists/index.vue'
import ArtistAllAlbums from '@/views/Artist/Albums/index.vue'
import ArtistAllSingles from '@/views/Artist/Singles/index.vue'
import ArtistAllAppearsOn from '@/views/Artist/AppearsOn/index.vue'
import GetPlaylists from '@/views/Search/SearchResult/GetPlaylists/index.vue'
import SearchResult from '@/views/Search/SearchResult/index.vue'
import Track from '@/views/Track/index.vue'
import Album from '@/views/Album/index.vue'
import Artist from '@/views/Artist/index.vue'
import Playlist from '@/views/Playlist/index.vue'
import User from '@/views/User/index.vue'
import Browse from '@/views/Browse/index.vue'
import FeaturedPlaylists from '@/views/Dashboard/FeaturedPlaylists/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
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
          path: '/featured-playlists',
          name: 'FeaturedPlaylists',
          component: FeaturedPlaylists
        }
      ]
    },
    {
      path: '/search',
      component: Layout,
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
            },
            {
              path: 'playlists',
              name: 'GetPlaylists',
              component: GetPlaylists
            }
          ]
        }
      ]
    },
    {
      path: '/artist/:artistId',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Artist',
          component: Artist
        },
        {
          path: 'albums',
          name: 'ArtistAllAlbums',
          component: ArtistAllAlbums
        },
        {
          path: 'singles',
          name: 'ArtistAllSingles',
          component: ArtistAllSingles
        },
        {
          path: 'appears-on',
          name: 'ArtistAllAppearsOn',
          component: ArtistAllAppearsOn
        }
      ]
    },
    {
      path: '/track/:trackId',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Track',
          component: Track
        }
      ]
    },
    {
      path: '/album/:albumId',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Album',
          component: Album
        }
      ]
    },
    {
      path: '/playlist/:playlistId',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Playlist',
          component: Playlist
        }
      ]
    },
    {
      path: '/user/:userId',
      component: Layout,
      children: [
        {
          path: '',
          name: 'User',
          component: User
        }
      ]
    },
    {
      path: '/browse/:categoryId',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Browse',
          component: Browse
        }
      ]
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
      if (useUserStore().uid) {
        // Has userData
        next()
      } else {
        // Has no userData
        try {
          await useUserStore().getUserData()
          next()
        } catch (error) {
          // Bad or expired token
          // window.localStorage.clear()
          // next('/login')
          console.log('e: ' + error)
          next()
        }
      }
    }
  }
})

export default router
