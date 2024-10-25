import axios from 'axios'
import settings from '@/settings.js'

const { tokenEndpoint } = settings

// https://axios-http.com/docs/instance
const service = axios.create({
  baseURL: tokenEndpoint
})

export default service
