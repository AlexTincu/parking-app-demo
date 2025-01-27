// import './assets/main.css'
import './assets/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'
// import "./assets/tailwind.css"; // Import Tailwind CSS


axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Check if error response status is 401 and message matches
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === 'Token is not valid, please refresh it'
    ) {
      store.dispatch('auth/logout') // Dispatch the logout action
      router.push('/login') // Redirect to login page
    }
    return Promise.reject(error) // Reject the error to handle it further if needed
  },
)

createApp(App).use(store).use(router).mount('#app')
