import {
  getLocations,
  removeLocation,
  updateLocationRate,
  addSpotToLocation,
  removeSpotFromLocation,
  getRevenue,
} from '@/services/apiService'

const state = () => ({
  locations: [],
  revenue: null,
  error: null,
})

const getters = {
  locations: (state) => state.locations,
  revenue: (state) => state.revenue,
  error: (state) => state.error,
}

const actions = {
  async fetchLocations({ commit }, params) {
    try {
      const { data } = await getLocations(params)
      commit('setLocations', data)
    } catch (error) {
      commit('setError', error.response.data.message || 'Failed to fetch locations')
    }
  },
  async updateHourlyRate({ commit }, { locationId, newRate }) {
    try {
      await updateLocationRate(locationId, newRate)
      commit('updateLocationRate', { locationId, newRate })
    } catch (error) {
      commit('setError', error.response.data.message || 'Failed to update rate')
    }
  },
  async removeLocation({ commit }, locationId) {
    try {
      await removeLocation(locationId)
      commit('removeLocation', { locationId })
    } catch (error) {
      commit('setError', error.response.data.message || 'Failed to remove spot')
    }
  },
  async addSpot({ commit }, { locationId, spotData }) {
    try {
      const { data } = await addSpotToLocation(locationId, spotData)
      commit('addSpot', { locationId, spot: data })
    } catch (error) {
      commit('setError', error.response.data.message || 'Failed to add spot')
    }
  },
  async removeSpot({ commit }, { locationId, spotId }) {
    try {
      await removeSpotFromLocation(locationId, spotId)
      commit('removeSpot', { locationId, spotId })
    } catch (error) {
      commit('setError', error.response.data.message || 'Failed to remove spot')
    }
  },
  async fetchRevenue({ commit }) {
    try {
      const { data } = await getRevenue()
      commit('setRevenue', data)
    } catch (error) {
      commit('setError', error.response.data.message || 'Failed to fetch revenue')
    }
  },
}

const mutations = {
  setLocations(state, locations) {
    state.locations = locations
  },
  setRevenue(state, revenue) {
    state.revenue = revenue
  },
  setError(state, error) {
    state.error = error
  },
  removeLocation(state, { locationId }) {
    state.locations.locations = state.locations.locations.filter((loc) => loc._id !== locationId)
  },
  updateLocationRate(state, { locationId, newRate }) {
    const location = state.locations.locations.find((loc) => loc._id === locationId)
    if (location) location.hourlyRate = newRate
  },
  addSpot(state, { locationId, spot }) {
    const location = state.locations.locations.find((loc) => loc._id === locationId)
    if (location) location.spots.push(spot)
  },
  removeSpot(state, { locationId, spotId }) {
    const location = state.locations.locations.find((loc) => loc._id === locationId)
    if (location) location.spots = location.spots.filter((spot) => spot._id !== spotId)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
