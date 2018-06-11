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
        <div class="m-2 mt-2">
          <h2 class="m-2">{{ polldata.title }} Poll</h2>
        </div>
      </div>
      <div
        v-if="displayPoll"
        :key="2"
        class="d-flex flex-column justify-content-around m-2">
        <div class="d-flex justify-content-around">
          <div class="m-2 mt-2 titleContainer">
            <h2 class="m-2">{{ polldata.title }} Poll</h2>
            <p class="mt-5">{{ polldata.description }}</p>
            <br>
            <br>
            <a
              v-show="route === '/userPage'"
              class="cursor"
              @click.prevent="deletePoll(polldata)">Delete Poll</a>
            <p>Created by {{ polldata.creator }}</p>
          </div>
          <div class="m-2 mt-3">
            <h4>Vote:</h4>
            <div class="d-flex flex-column flex-wrap buttonContainer">
              <button
                v-for="(option, index) in polldata.options"
                :key="index"
                :style="({backgroundColor: polldata.colors[index]})"
                class="btn m-1"
                @click="addNewVoteLocal($event.target.textContent)"
              >{{ option }}</button>
            </div>
          </div>
          <div class="chart-container mt-3 mb-3 p-2">
            <canvas :id="`poll-chart${index}`"/>
          </div>
          <font-awesome-icon
            :icon="icon"
            size="2x"
            class="cursor m-2 align-self-start"
            @click.prevent="toggleDisplayPoll" />
        </div>
        <div>
          <new-poll
            :existingpollcolors="existingPollColors"
            :existingpolloptions="existingPollOptions"
            :id="pollId"
            :calledfromnewpoll="false"/>
        </div>
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
    }},
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
            position: 'right'
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
      const userVoteRecord = this.getLocalId + (this.getUserName || '')
      if (this.polldata.voters.includes(userVoteRecord)) {
        this.setUserMessage('Sorry you cannot vote twice')
        return
      }
      this.addNewVote({ id: this.polldata.id, 'selection': selection, voter: userVoteRecord })
      this.myChart.update()
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
  .buttonContainer {
    max-height: 250px;
  }
  .titleContainer {
    max-width: 325px;
  }
  .chart-container {
    width: 550px;
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

  @media screen and (max-width: 1000px) {
    .chart-container {
      width: 350px;
    }
  }
</style>
