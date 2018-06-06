import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.ipify.org?format=json'
})

export default instance
