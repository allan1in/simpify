import axios from 'axios'
import settings from '@/settings.js'
import router from '@/router'

const { tokenEndpoint } = settings

// https://axios-http.com/docs/instance
const service = axios.create({
  baseURL: tokenEndpoint
})

service.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // Invalid refresh token
    if (error.status === 400) {
      localStorage.clear()
      router.push({ name: 'Login' })
    }
    return Promise.reject(error)
  }
)

export default service
