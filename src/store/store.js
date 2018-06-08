import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    username: null,
    localId: null,
    invalidCredentials: false,
    takenCredentials: false,
    returningUser: false,
    polls: [],
    userMessage: null
  },
  mutations: {
    setAuthUser (state, userData) {
      state.idToken = userData.idToken
      state.username = userData.username
    },
    setStoreUser (state, userData) {
      state.username = userData.username
    },
    setClearAuthData (state) {
      state.idToken = null
      state.username = null
      state.returningUser = false
    },
    setInvalidCredentials (state, payload) {
      state.invalidCredentials = payload
    },
    setTakenCredentials (state, payload) {
      state.takenCredentials = payload
    },
    setReturningUser (state, payload) {
      state.returningUser = payload
    },
    setPolls (state, payload) {
      state.polls = []
      Vue.nextTick(function () {
        payload.forEach(load => {
          let poll = {
            pollData: {
              title: load.title,
              description: load.description,
              creator: load.creator,
              voters: load.voters,
              options: load.options,
              colors: load.colors,
              votes: load.votes,
              id: load.id
            }
          }
          state.polls.push(poll)
        })
      })
    },
    setNewVote (state, payload) {
      state.polls.forEach(poll => {
        if (poll.pollData.id === payload.id) {
          const location = poll.pollData.options.indexOf(payload.selection)
          poll.pollData.votes[location] += 1
          poll.pollData.voters.push(payload.voter)
        }
      })
    },
    setLocalId (state, payload) {
      state.localId = payload
    },
    setMessage (state, payload) {
      state.userMessage = payload
    }
  },
  actions: {
    signUp ({commit, dispatch}, authData) {
      axios.post('/auth/signup', {
        email: authData.email,
        password: authData.password,
        username: authData.username
      })
        .then(res => {
          commit('setAuthUser', {
            idToken: res.data.idToken,
            username: authData.username
          })
          dispatch('storeDataToLocalStorage', { expiresIn: res.data.expiresIn, idToken: res.data.idToken })
          dispatch('setUserMessage', res.data.message)
          router.push('/userPage')
        })
        .catch(error => {
          if (error.response.status === 401) {
            commit('setTakenCredentials', error.response.data)
            return
          }
          console.log(error)
        })
    },
    logIn ({commit, dispatch}, authData) {
      axios.post('/auth/login', {
        username: authData.username,
        password: authData.password
      })
        .then(res => {
          commit('setInvalidCredentials', false)
          commit('setAuthUser', {
            idToken: res.data.idToken,
            username: authData.username
          })
          dispatch('storeDataToLocalStorage', { expiresIn: res.data.expiresIn, idToken: res.data.idToken })
          dispatch('setUserMessage', res.data.message)
          router.push('/userPage')
        })
        .catch(error => {
          if (error.response.status === 401) {
            commit('setInvalidCredentials', error.response.data)
            return
          }
          console.log(error)
        })
    },
    tryAutoLogin ({commit, dispatch}) {
      const savedData = JSON.parse(localStorage.getItem('votingAppUserData'))
      if (!savedData) {
        return
      }
      const expirationDate = savedData.expirationDate
      const now = new Date()
      if (now >= expirationDate) {
        return
      }
      commit('setAuthUser', {
        idToken: savedData.idToken,
        username: null
      })
      dispatch('fetchUser')
    },
    logout ({commit, dispatch}) {
      commit('setClearAuthData')
      dispatch('setUserMessage', 'Logged out')
      localStorage.removeItem('votingAppUserData')
      router.replace('/home')
    },
    fetchUser ({commit, dispatch, state}) {
      if (!state.idToken) {
        return
      }
      axios.post('/auth/verifyUser', { idToken: state.idToken })
        .then(res => {
          commit('setStoreUser', res.data.username)
          commit('setAuthUser', {
            idToken: res.data.idToken,
            username: res.data.username
          })
          dispatch('storeDataToLocalStorage', { expiresIn: res.data.expiresIn, idToken: res.data.idToken })
          dispatch('setUserMessage', res.data.message)
          router.push('/userPage')
        })
        .catch(error => {
          if (error.response.data.err === 'login') {
            dispatch('setUserMessage', error.response.data.message)
            commit('setReturningUser', true)
            router.push('/login')
            return
          }
          if (error.response.data.err === 'Invalid Token') {
            dispatch('setUserMessage', error.response.data.message)
            dispatch('logout')
            return
          }
          console.log(error)
        })
    },
    storeDataToLocalStorage ({commit}, payload) {
      const now = new Date()
      const expirationDate = new Date(now.getTime() + payload.expiresIn * 1000)
      localStorage.setItem('votingAppUserData', JSON.stringify({
        'idToken': payload.idToken,
        'expirationDate': expirationDate
      }))
    },
    fetchPolls ({commit}) {
      axios.get('users/viewPolls')
        .then(data => {
          const polls = data.data.reduce((res, item) => {
            let optionsArr = []
            let colorsArr = []
            let votesArr = []

            item.options.forEach(option => {
              optionsArr.push(option.optionName)
              colorsArr.push(option.details.optionColor)
              votesArr.push(option.details.optionNumVotes)
            })

            const poll = {
              title: item.title,
              description: item.description,
              creator: item.creator,
              id: item._id,
              voters: item.voters,
              options: optionsArr,
              colors: colorsArr,
              votes: votesArr
            }

            res.push(poll)
            return res
          }, [])
          commit('setPolls', polls)
        })
        .catch(error => console.log(error))
    },
    deletePoll ({dispatch}, payload) {
      axios.delete('users/deletePoll', payload.id)
        .then(res => {
          dispatch('setUserMessage', res.data)
          dispatch('fetchPolls')
        })
        .catch(error => {
          dispatch('setUserMessage', error.response.data)
          console.log(error)
        })
    },
    submitNewPoll ({dispatch, state}, payload) {
      const newPoll = {
        title: payload.title,
        description: payload.description,
        creator: state.username || '',
        options: payload.options.reduce((res, option) => {
          const newOption = {
            optionName: option.value,
            details: {
              optionColor: option.color.colorRGBA,
              optionNumVotes: 0
            }
          }
          res.push(newOption)
          return res
        }, []),
        voters: []
      }
      axios.post('users/newPoll', { idToken: state.idToken, 'newPoll': newPoll })
        .then(res => {
          dispatch('setUserMessage', res.data)
          dispatch('fetchPolls')
        })
        .catch(error => {
          dispatch('setUserMessage', error.response.data)
          console.log(error)
        })
    },
    addNewVote ({commit, dispatch}, payload) {
      const vote = {
        id: payload.id,
        selection: payload.selection,
        voter: payload.voter
      }
      commit('setNewVote', payload)
      axios.patch('users/addNewVote', vote)
        .then(res => {
          dispatch('setUserMessage', res.data)
        })
        .catch(error => {
          dispatch('setUserMessage', error.response.data)
          console.log(error)
        })
    },
    getOrCreateLocalId ({commit}) {
      let localIdNumber = JSON.parse(localStorage.getItem('votingAppLocalId'))
      if (!localIdNumber) {
        localIdNumber = Math.random()
        localStorage.setItem('votingAppLocalId', JSON.stringify(localIdNumber))
      }
      commit('setLocalId', localIdNumber)
    },
    setUserMessage ({commit}, payload) {
      commit('setMessage', payload)
    }
  },
  getters: {
    getUserName (state) {
      return state.username
    },
    getIsAuth (state) {
      return state.idToken !== null && state.username !== null
    },
    getReturningUser (state) {
      return state.returningUser
    },
    getPolls (state) {
      return state.polls
    },
    getInvalidCredentials (state) {
      return state.invalidCredentials
    },
    getTakenCredentials (state) {
      return state.takenCredentials
    },
    getLocalId (state) {
      return state.localId
    },
    getMessage (state) {
      return state.userMessage
    }
  }
})
