<template>
  <div
    id="app"
    class="container bg">
    <app-header/>
    <app-message/>
    <transition
      :name="transitionName"
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
  data () {
    return {
      transitionName: ''

    }
  },
  watch: {
    '$route' (to, from) {
      const toName = Number(to.meta)
      const fromName = Number(from.meta)
      this.transitionName = toName > fromName ? 'slide-right' : 'slide-left'
    }
  },
  created () {
    this.tryAutoLogin()
    this.fetchPolls()
    this.getOrCreateLocalId()
  },
  methods: {
    ...mapActions([
      'tryAutoLogin',
      'fetchPolls',
      'getOrCreateLocalId'
    ])
  }
}
</script>

<style>
.slide-right-enter {
  transform: translateX(400px);
  opacity: 0;
}
.slide-right-enter-active {
  transition: all 300ms ease;
}
.slide-right-leave-active {
  transition: all 300ms ease;
  transform: translateX(-400px);
  opacity: 0;
}
.slide-left-enter {
  transform: translateX(-400px);
  opacity: 0;
}
.slide-left-enter-active {
  transition: all 300ms ease;
}
.slide-left-leave-active {
  transition: all 300ms ease;
  transform: translateX(400px);
  opacity: 0;
}
</style>
