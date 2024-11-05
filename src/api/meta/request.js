import axios from 'axios'
import settings from '@/settings.js'
import { useUserStore } from '@/stores/user'

const { baseURL } = settings

// https://axios-http.com/docs/instance
const service = axios.create({
  baseURL: baseURL
})

// https://axios-http.com/docs/interceptors
// Add a request interceptor
service.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (localStorage.getItem('access_token')) {
      // Let each request carry access_token
      config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // Bad or expired token
    if (error.status === 401) {
      console.log('Bad or expired token')
      await useUserStore().refreshToken()
      error.config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
      const res = await service.request(error.config)
      return res
    } else {
      console.log(error)
      alert(error.response.data)
    }

    return Promise.reject(error)
  }
)

export default service
