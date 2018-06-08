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
  { path: '/home',
    component: Home,
    meta: '0'},
  { path: '/signup',
    component: SignUp,
    meta: '1',
    beforeEnter: (to, from, next) => {
      store.commit('setInvalidCredentials', false)
      store.commit('setTakenCredentials', false)
      next()
    } },
  { path: '/login',
    component: LogIn,
    meta: '2',
    beforeEnter: (to, from, next) => {
      store.commit('setInvalidCredentials', false)
      store.commit('setTakenCredentials', false)
      next()
    } },
  { path: '/polls',
    component: Polls,
    meta: '3',
    props: (route) => ({ query: route.query.query })},
  { path: '/userPage',
    component: UserPage,
    meta: '4' },
  { path: '/*', redirect: '/home' }
]

export default new VueRouter({mode: 'history', routes})
