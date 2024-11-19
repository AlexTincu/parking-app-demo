import axios from 'axios'

// I choose to store the user to use it's role to showing different content
const state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  error: null,
}

const mutations = {
  setToken(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  setUser(state, user) {
    state.user = user
    localStorage.setItem('user', JSON.stringify(user))
  },
  clearAuth(state) {
    state.user = null
    state.token = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  setError(state, error) {
    state.error = error
  },
  clearError(state) {
    state.error = null
  },
}

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials)

      // Assuming the token is in response.data.token
      commit('setToken', response.data.token)
      commit('setUser', response.data.user)

      return true
    } catch (error) {
      if (error.response && error.response.status === 401) {
        commit('setError', error.response.data.message || 'Invalid credentials.')
      } else {
        commit('setError', 'An error occurred. Please try again later.')
        console.log(error)
      }

      return false
    }
  },

  logout({ commit }) {
    commit('clearAuth')
  },
}

const getters = {
  token: (state) => state.token,
  user: (state) => state.user,
  role: (state) => state.user?.role,
  isAuthenticated: (state) => !!state.token,
  error: (state) => state.error,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
