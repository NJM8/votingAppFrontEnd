import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'

import Home from '../components/Main/Home.vue'
import UserPage from '../components/Main/UserPage.vue'
import LogIn from '../components/Auth/LogIn.vue'
import SignUp from '../components/Auth/SignUp.vue'
import Polls from '../components/Poll/Polls.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/home', component: Home, name: 'home' },
  { path: '/signup',
    component: SignUp,
    beforeEnter: (to, from, next) => {
      store.commit('setInvalidCredentials', false)
      store.commit('setTakenCredentials', false)
      next()
    } },
  { path: '/login',
    component: LogIn,
    beforeEnter: (to, from, next) => {
      store.commit('setInvalidCredentials', false)
      store.commit('setTakenCredentials', false)
      next()
    } },
  { path: '/polls',
    component: Polls,
    props: (route) => ({ query: route.query.q })},
  { path: '/userPage', component: UserPage },
  { path: '/*', redirect: { name: 'home' } }
]

export default new VueRouter({mode: 'history', routes})
