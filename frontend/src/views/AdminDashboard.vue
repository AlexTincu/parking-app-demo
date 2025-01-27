<template>
  <div class="min-h-screen p-8 bg-gray-100 admin-dashboard">
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
    </div>

    <!-- Locations Section -->
    <section class="p-6 mb-8 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-2xl font-semibold text-gray-700">Locations</h2>
      <div
        v-for="location in paginatedLocations"
        :key="location._id"
        class="pb-4 mb-4 border-b border-gray-200"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-medium text-gray-800">

            {{ location.name }} - {{ location.address }} <br />
            <span class="text-sm text-gray-500"
              >Occupied: {{ location.occupiedSpots }} / {{ location.totalSpots }} -
              {{ location.occupationPercentage }}%</span
            >
            <span class="mx-2 text-sm text-gray-500">|</span>
            <span class="text-sm text-gray-500">Rate: ${{ location.hourlyRate }}/hr</span>
          </h3>
          <Button @click="goToLocationDetails(location._id)" variant="ghost">Details</Button>
        </div>

        <!-- Update Rate Input -->
        <div class="flex items-center mt-4 space-x-2">
          <input
            type="number"
            v-model.number="location.newRate"
            placeholder="New Rate"
            class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            @click="updateRate(location._id, location.newRate)"
          >
            Update Rate
          </Button>
          <Button @click="removeTheLocation(location._id)" variant="destructive">Remove Location</Button>
        </div>

        <!-- Spots List -->
        <ul class="mt-6">
          <li
            v-for="spot in location.spots"
            :key="spot._id"
            class="flex items-center justify-between mb-2 text-gray-600"
          >
            <span>Spot ID: {{ spot._id }}</span>
            <Button
              @click="removeSpot(location._id, spot._id)"
              class="px-3 py-1 font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Remove
            </Button>
          </li>
        </ul>
      </div>

      <!-- Pagination Controls -->
      <div class="flex items-center justify-between mt-4">
        <Button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 font-medium text-gray-800 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Previous
        </Button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <Button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 font-medium text-gray-800 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Next
        </Button>
      </div>
    </section>

    <!-- Revenue Section -->
    <section class="p-6 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-2xl font-semibold text-gray-700">Revenue</h2>
      <p v-if="revenue" class="text-xl font-medium text-gray-800">
        Total Revenue: <span class="text-green-600">${{ revenue.total }}</span>
      </p>
      <p v-else class="text-gray-500">No revenue data available.</p>
    </section>

    <!-- Error Message -->
    <p v-if="error" class="mt-6 text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import { Button } from '@/components/ui/Button'

const store = useStore()
const router = useRouter()

const searchQuery = ref('')
const currentPage = ref(1)
const limit = 5 // Define your page size if needed

const fetchLocations = () => {
  store.dispatch('admin/fetchLocations', { page: currentPage.value, limit, search: searchQuery.value })
}

onMounted(() => {
  fetchLocations() // Fetch locations on component creation
})

// Debounced search function
const debouncedSearch = debounce(() => {
  fetchLocations()
}, 500)

// Watch for changes in searchQuery and call the debounced search function
watch(searchQuery, debouncedSearch)

const paginatedLocations = computed(() => {
  const locations = store.getters['admin/locations'].locations || []
  return locations.map((location) => {
    const occupationPercentage = location.totalSpots
      ? ((location.occupiedSpots / location.totalSpots) * 100).toFixed(0)
      : 0

    return {
      ...location,
      occupationPercentage,
    }
  })
})

const totalPages = computed(() => store.getters['admin/locations'].totalPages)
const revenue = computed(() => store.getters['admin/revenue'])
const error = computed(() => store.getters['admin/error'])

const updateRate = (locationId, newRate) => {
  store.dispatch('admin/updateHourlyRate', { locationId, newRate })
}

const goToLocationDetails = (locationId) => {
  alert('not implemented yet')
  router.push({ name: 'LocationDetails', params: { id: locationId } })
}

const removeTheLocation = (locationId) => {
  store.dispatch('admin/removeLocation', locationId)
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return // Prevent invalid page numbers
  currentPage.value = page
  fetchLocations() // Fetch locations for the new page
}
</script>
