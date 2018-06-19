<template>
  <div
    v-show="showPoll"
    class="col-12 border rounded text-center mt-3 mb-3 bg-white">
    <transition
      name="flip"
      mode="out-in">
      <div
        v-if="!displayPoll"
        :key="1"
        class="cursor"
        @click="toggleDisplayPoll">
        <div class="m-2">
          <h2>{{ polldata.title }} Poll</h2>
        </div>
      </div>
      <div
        v-if="displayPoll"
        :key="2"
        class="d-flex flex-column justify-content-around align-items-center">
        <div class="d-flex col-10 col-md-12 col-xl-12 flex-column flex-xl-row justify-content-around align-items-center m-2">
          <font-awesome-icon
            :icon="icon"
            size="2x"
            class="cursor top-right"
            @click.prevent="toggleDisplayPoll" />
          <div class="">
            <h2>{{ polldata.title }} Poll</h2>
            <p>{{ polldata.description }}</p>
            <a
              v-show="route === '/userPage'"
              class="cursor"
              @click.prevent="deletePoll(polldata)">Delete Poll</a>
            <p>Created by {{ polldata.creator }}</p>
            <h4>Vote:</h4>
            <button
              v-for="(option, index) in polldata.options"
              :key="index"
              :style="({backgroundColor: polldata.colors[index]})"
              class="btn btn-sm m-1"
              @click="addNewVoteLocal($event.target.textContent)"
            >{{ option }}: {{ polldata.votes[index] }}</button>
          </div>
          <div class="chart-container ">
            <canvas
              :id="`poll-chart${index}`"
              class="m-2"/>
          </div>
        </div>
        <new-poll
          :existingpollcolors="existingPollColors"
          :existingpolloptions="existingPollOptions"
          :id="pollId"
          :calledfromnewpoll="false"/>
      </div>
    </transition>
  </div>
</template>

<script>
import Chart from 'chart.js'
import Router from '../../router'
import { mapActions, mapGetters } from 'vuex'
import NewPoll from './NewPoll'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'

export default {
  components: {
    FontAwesomeIcon,
    NewPoll
  },
  props: {
    polldata: {
      type: Object,
      default: function () {
        return {}
      }
    },
    index: {
      type: Number,
      default: function () {
        return 0
      }
    },
    searched: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      route: Router.currentRoute.path,
      displayPoll: false,
      myChart: null,
      pollChartData: {
        type: 'polarArea',
        data: {
          labels: this.polldata.options,
          datasets: [
            {
              data: this.polldata.votes,
              backgroundColor: this.polldata.colors
            }
          ]
        },
        options: {
          responsive: true,
          legend: {
            display: false
          },
          animation: {
            animateRotate: true,
            animateScale: true
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'getLocalId',
      'getUserName'
    ]),
    showPoll () {
      if (this.route === '/userPage') {
        if (this.polldata.creator === this.getUserName) {
          return true
        } else {
          return false
        }
      } else if (this.route === '/polls') {
        if (this.searched === 'Select a user') {
          return true
        } else {
          if (this.searched === this.polldata.creator) {
            return true
          } else {
            return false
          }
        }
      }
    },
    icon () {
      return faTimes
    },
    existingPollColors () {
      return this.polldata.colors
    },
    existingPollOptions () {
      return this.polldata.options
    },
    pollId () {
      return this.polldata.id
    }
  },
  watch: {
    polldata: {
      handler: function () {
        if (this.myChart) {
          this.myChart.update()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'setUserMessage',
      'addNewVote',
      'deletePoll'
    ]),
    createChart (chartId, chartData) {
      const ctx = document.getElementById(chartId)
      this.myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      })
    },
    addNewVoteLocal (selection) {
      const userVoteRecord = this.getUserName || this.getLocalId
      if (this.polldata.voters.includes(userVoteRecord)) {
        this.setUserMessage('Sorry you cannot vote twice')
      } else {
        this.addNewVote({ id: this.polldata.id, 'selection': selection.split(':')[0], voter: userVoteRecord })
        this.myChart.update()
      }
    },
    toggleDisplayPoll () {
      this.displayPoll = !this.displayPoll
      if (this.displayPoll) {
        let chartTimer = setInterval(() => {
          if (document.getElementById(`poll-chart${this.index}`)) {
            this.createChart(`poll-chart${this.index}`, this.pollChartData)
            clearInterval(chartTimer)
          }
        }, 20)
      } else {
        setTimeout(() => {
          this.myChart.destroy()
        }, 450)
      }
    }
  }
}
</script>

<style>
  .cursor {
    cursor: pointer;
  }
  .chart-container {
    width: 650px;
  }
  .flip-enter {
    transform: scaleY(0.1);
    opacity: 0;
  }
  .flip-enter-active {
    transition: all 500ms ease;
  }
  .flip-leave-active {
    transition: all 500ms ease;
    transform: scaleY(0.1);
    opacity: 0;
  }
  .top-right {
    position: absolute;
    top: 0px;
    right: 0px;
  }
  @media screen and (max-width: 430px) {
    .chart-container {
      width: 450px;
    }
  }
  @media screen and (max-width: 765px) {
    .top-right {
      top: 0px;
      right: -30px;
    }
  }
</style>
