<template>
  <div class="admin-dashboard p-8 bg-gray-100 min-h-screen">
    <!-- Navigation Menu -->
    <nav class="mb-6">
      <router-link to="/admin" class="mr-4">Locations</router-link>
      <router-link to="/admin/reservations" class="mr-4">Reservations</router-link>
      <router-link to="/admin/revenue">Revenue</router-link>
    </nav>

    <!-- Search Input -->
    <div class="flex items-center mb-4 space-x-2">
      <input
        v-model="searchQuery"
        placeholder="Search Location by Name or Address"
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        @click="searchLocations()"
        @keyup.enter="searchLocations"
      >
        Search
      </button>
    </div>

    <!-- Locations Section -->
    <section class="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Locations</h2>
      <div
        v-for="location in paginatedLocations"
        :key="location._id"
        class="border-b border-gray-200 pb-4 mb-4"
      >
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-medium text-gray-800">
            {{ location.name }} - {{ location.address }} <br />
            <span class="text-gray-500 text-sm"
              >Occupied: {{ location.occupiedSpots }} / {{ location.totalSpots }} -
              {{ location.occupationPercentage }}%</span
            >
            <span class="text-gray-500 text-sm mx-2">|</span>
            <span class="text-gray-500 text-sm">Rate: ${{ location.hourlyRate }}/hr</span>
          </h3>
          <button
            @click="goToLocationDetails(location._id)"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md"
          >
            Details
          </button>
        </div>

        <!-- Update Rate Input -->
        <div class="flex items-center mt-4 space-x-2">
          <input
            type="number"
            v-model.number="location.newRate"
            placeholder="New Rate"
            class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="updateRate(location._id, location.newRate)"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Update Rate
          </button>
          <button
            @click="removeTheLocation(location._id)"
            class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
          >
            Remove Location
          </button>
        </div>

        <!-- Spots List -->
        <ul class="mt-6">
          <li
            v-for="spot in location.spots"
            :key="spot._id"
            class="flex items-center justify-between text-gray-600 mb-2"
          >
            <span>Spot ID: {{ spot._id }}</span>
            <button
              @click="removeSpot(location._id, spot._id)"
              class="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-md"
            >
              Remove
            </button>
          </li>
        </ul>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-between items-center mt-4">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
        >
          Next
        </button>
      </div>
    </section>

    <!-- Revenue Section -->
    <section class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Revenue</h2>
      <p v-if="revenue" class="text-xl text-gray-800 font-medium">
        Total Revenue: <span class="text-green-600">${{ revenue.total }}</span>
      </p>
      <p v-else class="text-gray-500">No revenue data available.</p>
    </section>

    <!-- Error Message -->
    <p v-if="error" class="text-red-500 mt-6">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      searchQuery: '',
      debouncedQuery: '',
      currentPage: 1,
      limit: 5, // Define your page size if needed
    }
  },
  created() {
    this.fetchLocations({ page: this.currentPage, limit: this.limit, search: this.searchQuery }) // Fetch locations on component creation
  },
  computed: {
    ...mapGetters('admin', ['locations', 'revenue', 'error']),
    paginatedLocations() {
      // calculate the percentage of occupation for each location
      const locations = this.locations.locations || []
      return locations.map((location) => {
        const occupationPercentage = location.totalSpots
          ? ((location.occupiedSpots / location.totalSpots) * 100).toFixed(0)
          : 0

        return {
          ...location,
          occupationPercentage,
        }
      })
    },
    totalPages() {
      return this.locations.totalPages
    },
  },
  methods: {
    searchLocations() {
      this.fetchLocations({ page: this.currentPage, limit: this.limit, search: this.searchQuery })
    },
    ...mapActions('admin', [
      'fetchLocations',
      'updateHourlyRate',
      'addSpot',
      'removeSpot',
      'fetchRevenue',
      'removeLocation', // New action for removing a location
    ]),
    updateRate(locationId, newRate) {
      this.updateHourlyRate({ locationId, newRate })
    },
    goToLocationDetails(locationId) {
      alert('not implemented yet')
      this.$router.push({ name: 'LocationDetails', params: { id: locationId } })
    },
    removeTheLocation(locationId) {
      this.removeLocation(locationId)
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return // Prevent invalid page numbers
      this.currentPage = page
      this.fetchLocations({ page: this.currentPage, limit: this.limit, search: this.searchQuery }) // Fetch locations for the new page
    },
  },
}
</script>
