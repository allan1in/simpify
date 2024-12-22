import axios from 'axios'
import router from '@/router'
import Message from '@/components/Message'
import i18n from '@/includes/i18n'

const tokenEndpoint = import.meta.env.VITE_TOKEN_ENDPOINT

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
    } else if (error.message === 'ERR_NETWORK') {
      // Network error
      Message(`${i18n.global.t('message.check_network')}`)
    } else {
      console.log(error)
      Message(`${i18n.global.t('message.something_wrong')}`)
    }
    return Promise.reject(error)
  }
)

export default service
