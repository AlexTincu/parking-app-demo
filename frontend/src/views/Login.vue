<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-800">Login to Your Account</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            v-model="email"
            id="email"
            required
            placeholder="Enter your email"
            class="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            v-model="password"
            id="password"
            required
            placeholder="Enter your password"
            class="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </form>

      <p class="text-sm text-center text-gray-600">
        Don't have an account?
        <router-link to="/register" class="text-indigo-600 hover:underline">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const store = useStore()
const router = useRouter()
const email = ref('')
const password = ref('')

// Computed property to access the error from Vuex
const authError = computed(() => store.getters['auth/error'])

const isAdmin = computed(() => store.getters['auth/role'] === 'admin')

const handleLogin = async () => {
  const credentials = { email: email.value, password: password.value }

  const isSuccess = await store.dispatch('auth/login', credentials)

  if (isSuccess) {    
    router.push(isAdmin ? '/admin' : '/user')
  }
}

// Watch for changes in the error and display a toast notification
watch(authError, (newError) => {
  if (newError) {
    toast.error(newError, {
      position: 'bottom-right',
      autoClose: 3000,
    })
    store.commit('auth/clearError') // Clear the error after displaying it
  }
})
</script>
