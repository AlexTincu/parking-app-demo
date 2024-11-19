import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL + '/admin'

// Get all locations
export const getLocations = async (params) => {
  const { page, limit, search } = params
  return await axios.get(`${API_BASE_URL}/locations?page=${page}&limit=${limit}&search=${search}`)
}

// Update hourly rate for a location
export const updateLocationRate = async (locationId, newRate) => {
  return await axios.put(`${API_BASE_URL}/locations/${locationId}/pricing`, { hourlyRate: newRate })
}
// Remove a location
export const removeLocation = async (locationId) => {
  return await axios.delete(`${API_BASE_URL}/locations/${locationId}`)
}

// Add a new spot to a location
export const addSpotToLocation = async (locationId, spotData) => {
  return await axios.post(`${API_BASE_URL}/locations/${locationId}/spots`, spotData)
}

// Remove a spot from a location
export const removeSpotFromLocation = async (locationId, spotId) => {
  return await axios.delete(`${API_BASE_URL}/locations/${locationId}/spots/${spotId}`)
}

// Get revenue data
export const viewReservations = async () => {
  return await axios.get(`${API_BASE_URL}/rezervations`)
}
// Get revenue data
export const getRevenue = async () => {
  return await axios.get(`${API_BASE_URL}/revenue`)
}
