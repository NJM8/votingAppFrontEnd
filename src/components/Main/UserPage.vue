<template>
  <div>
    <div class="col-8 offset-2 border rounded mt-4 text-center bg-white">
      <h1>Welcome to your page {{ getUserName }}</h1>
      <h4>Here you can edit your polls or make some new ones.</h4>
      <button
        class="btn btn-info m-2"
        @click="makeNewPoll = !makeNewPoll">Make new poll</button>
    </div>
    <transition name="flip">
      <div
        v-show="makeNewPoll"
        class="w-100 border rounded mt-4 bg-white">
        <app-newpoll @form-submitted="makeNewPoll = false"/>
      </div>
    </transition>
    <div class="col-sm-8 offset-sm-2 col-md-4 offset-md-4 border rounded mt-4 text-center bg-white">
      <h1 v-if="checkMyPolls > 0">Here are your polls:</h1>
      <h1 v-else>You have not made any polls yet.</h1>
    </div>
    <app-polls/>
  </div>
</template>

<script>
import Polls from '../Poll/Polls'
import NewPoll from '../Poll/NewPoll'
import { mapGetters } from 'vuex'

export default {
  components: {
    'app-polls': Polls,
    'app-newpoll': NewPoll
  },
  data () {
    return {
      makeNewPoll: false
    }
  },
  computed: {
    ...mapGetters([
      'getUserName',
      'getPolls'
    ]),
    checkMyPolls () {
      return this.getPolls.reduce((count, poll) => {
        if (poll.pollData.creator === this.getUserName) {
          count += 1
        }
        return count
      }, 0)
    }
  }
}
</script>

<style>

</style>
