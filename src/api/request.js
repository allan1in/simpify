import axios from 'axios'
import settings from '@/settings.js'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const { baseURL } = settings

// https://axios-http.com/docs/instance
const service = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

// https://axios-http.com/docs/interceptors
// Add a request interceptor
service.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (useUserStore().access_token) {
      // Let each request carry access_token
      config.headers['Authorization'] = 'Bearer ' + useUserStore().access_token
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
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // Bad or expired token
    alert('Bad or expired token, please login again')
    window.localStorage.clear()
    router.push({ name: 'Login' })

    console.log(error)
    return Promise.reject(error)
  }
)

export default service
