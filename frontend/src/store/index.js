import { createStore } from 'vuex'
import auth from './modules/auth'
import admin from './modules/admin'
import parking from './modules/parking'

const store = createStore({
  modules: {
    auth,
    admin,
    parking,
  },
})

export default store
