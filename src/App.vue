<template>
  <div
    id="app"
    class="container bg">
    <app-header/>
    <app-message/>
    <transition
      name="slide"
      mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import Header from './components/Main/Header'
import Message from './components/Main/Message'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    'app-header': Header,
    'app-message': Message
  },
  created () {
    this.tryAutoLogin()
    this.fetchPolls()
    this.getIp()
  },
  methods: {
    ...mapActions([
      'tryAutoLogin',
      'fetchPolls',
      'getIp'
    ])
  }
}
</script>

<style>
.slide-enter {
  transform: translateX(400px);
  opacity: 0;
}
.slide-enter-active {
  transition: all 300ms ease;
}
.slide-leave-active {
  transition: all 300ms ease;
  transform: translateX(-400px);
  opacity: 0;
}
</style>
