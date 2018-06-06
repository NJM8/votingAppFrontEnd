<template>
  <div>
    <div
      v-if="route === '/polls'"
      class="col-sm-6 offset-sm-3 col-md-4 offset-md-4 border rounded bg-white mt-3 p-2">
      <label>Search for a users polls:</label>
      <select
        v-model="searched"
        class="form-control">
        <option
          v-for="name in names"
          :key="name"
          :selected="searched"
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
  props: {
    query: {
      type: String,
      default: function () {
        return 'Select a user'
      }
    }
  },
  data () {
    return {
      route: Router.currentRoute.path,
      searched: this.query
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
    },
    searchSelection () {
      return this.query || 'Select a user'
    }
  }
}
</script>

<style>

</style>
