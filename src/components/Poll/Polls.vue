<template>
  <div>
    <div
      v-if="route === '/polls'"
      class="col-4 offset-4 border rounded bg-white mt-3 p-2">
      <label>Search for a users polls:</label>
      <input
        v-model="searched"
        type="text"
        class="form-control"
        placeholder="Username">
    </div>
    <app-poll
      v-for="(poll, index) in getPolls"
      :polldata="poll.pollData"
      :key="index"
      :index="index"
      :searched="searched"/>
  </div>
</template>

<script>
import Router from '../../router'
import Poll from './Poll'
import { mapGetters } from 'vuex'

export default {
  components: {
    'app-poll': Poll
  },
  data () {
    return {
      route: Router.currentRoute.path,
      searched: ''
    }
  },
  computed: {
    ...mapGetters([
      'getPolls'
    ])
  }
}
</script>

<style>

</style>
