<template>
  <div
    v-if="compareCreator"
    class="col-12 border rounded text-center mt-3 mb-3 bg-white">
    <transition
      name="flip"
      mode="out-in">
      <div
        v-if="!seePoll"
        :key="1">
        <div class="m-2 mt-2">
          <h2 class="m-2">{{ polldata.title }} Poll</h2>
          <a
            v-if="!seePoll"
            class="cursor"
            @click="toggleSeePoll">See Poll</a>
        </div>
      </div>
      <div
        v-if="seePoll"
        :key="2"
        class="d-flex justify-content-around flex-wrap m-2">
        <div class="m-2 mt-2">
          <h2 class="m-2">{{ polldata.title }} Poll</h2>
          <p class="mt-5">{{ polldata.description }}</p>
          <br>
          <a
            class="cursor"
            @click.prevent="toggleSeePoll">Hide Poll</a>
          <br>
          <br>
          <a
            v-show="creator !== ''"
            class="cursor"
            @click.prevent="deletePoll(polldata)">Delete Poll</a>
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
        <div class="m-3 chart-container">
          <canvas :id="`poll-chart${index}`"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Chart from 'chart.js'
import { mapActions, mapGetters } from 'vuex'

export default {
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
    creator: {
      type: String,
      default: function () {
        return ''
      }
    }},
  data () {
    return {
      seePoll: false,
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
      'getUserIp',
      'getUserName'
    ]),
    compareCreator () {
      if (!this.creator) {
        return true
      } else {
        if (this.creator === this.polldata.creator) {
          return true
        } else {
          return false
        }
      }
    }
  },
  watch: {
    polldata: function () {
      this.createChart(`poll-chart${this.index}`, this.pollChartData)
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
      const userVoteRecord = this.getUserIp + (this.getUserName || '')
      if (this.polldata.voters.includes(userVoteRecord)) {
        this.setUserMessage('Sorry you cannot vote twice')
        return
      }
      this.addNewVote({ id: this.polldata.id, 'selection': selection, voter: userVoteRecord })
      this.createChart(`poll-chart${this.index}`, this.pollChartData)
    },
    toggleSeePoll () {
      this.seePoll = !this.seePoll
      if (this.seePoll) {
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
