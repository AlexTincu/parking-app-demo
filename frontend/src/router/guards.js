import { useStore } from 'vuex'
import { computed } from 'vue'

export function authGuard(to, from, next) {
  const store = useStore();
  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

  if (isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}

export function adminGuard(to, from, next) {
  const store = useStore();
  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const isAdmin = computed(() => store.getters['auth/role'] === 'admin')

  if (isAuthenticated && isAdmin) {
    next()
  } else {
    next('/')
  }
}
