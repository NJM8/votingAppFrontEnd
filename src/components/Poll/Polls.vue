<template>
  <div class="">
    <app-poll
      v-for="(poll, index) in getPolls"
      :polldata="poll.pollData"
      :key="index"
      :index="index"
      :creator="creator || ''"/>
  </div>
</template>

<script>
import Poll from './Poll'
import { mapGetters } from 'vuex'

export default {
  components: {
    'app-poll': Poll
  },
  props: {
    creator: {
      type: String,
      default: function () {
        return ''
      }
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
