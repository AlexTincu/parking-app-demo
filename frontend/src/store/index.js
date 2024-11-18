import { createStore } from 'vuex';
import auth from './modules/auth';
import parking from './modules/parking';

const store = createStore({
  modules: {
    auth,
    parking,
  },
});

export default store;
