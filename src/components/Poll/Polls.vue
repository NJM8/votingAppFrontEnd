<template>
  <div>
    <div
      v-if="route === '/polls'"
      class="col-4 offset-4 border rounded bg-white mt-3 p-2">
      <label>Search for a users polls:</label>
      <select
        v-model="searched"
        class="form-control">
        <option
          v-for="name in names"
          :key="name"
          :selected="'Select a user'"
        >{{ name }}</option>
      </select>
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
      searched: 'Select a user'
    }
  },
  computed: {
    ...mapGetters([
      'getPolls'
    ]),
    names () {
      return this.getPolls.reduce((res, poll) => {
        if (!res.includes(poll.pollData.creator)) {
          res.push(poll.pollData.creator)
        }
        return res
      }, ['Select a user'])
    }
  }
}
</script>

<style>

</style>
