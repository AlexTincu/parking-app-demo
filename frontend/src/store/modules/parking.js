import axios from 'axios'

const state = {
  parkingLocations: [],
  reservations: [],
}

const mutations = {
  setParkingLocations(state, locations) {
    state.parkingLocations = locations
  },
  setReservations(state, reservations) {
    state.reservations = reservations
  },
}

const actions = {
  async fetchParkingLocations({ commit }) {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/locations`)
    commit('setParkingLocations', data)
  },
  async fetchReservations({ commit }) {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/reservations`)
    commit('setReservations', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
