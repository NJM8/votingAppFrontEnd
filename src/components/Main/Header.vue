<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light mt-2 border rounded">
    <h2 class="navbar-brand">Voting App</h2>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"/>
    </button>
    <div
      id="navbarSupportedContent"
      class="collapse navbar-collapse">
      <ul class="navbar-nav w-100 d-flex">
        <router-link
          to="/home"
          tag="li"
          active-class="active"
          exact
          class="nav-item">
          <a class="nav-link">Home</a>
        </router-link>
        <router-link
          v-show="!getIsAuth"
          to="/signup"
          tag="li"
          active-class="active"
          class="nav-item">
          <a class="nav-link">Sign Up</a>
        </router-link>
        <router-link
          v-show="!getIsAuth"
          to="/login"
          tag="li"
          active-class="active"
          class="nav-item">
          <a class="nav-link">Log In</a>
        </router-link>
        <router-link
          to="/polls"
          tag="li"
          active-class="active"
          class="nav-item">
          <a class="nav-link">See Polls</a>
        </router-link>
        <router-link
          v-show="getIsAuth"
          to="/userPage"
          tag="li"
          active-class="active"
          class="nav-item">
          <a class="nav-link">{{ getUserName }}'s Page</a>
        </router-link>
        <li
          v-show="getIsAuth"
          class="nav-item">
          <a
            class="nav-link"
            @click.prevent="logout">Log Out</a>
        </li>
        <a
          class="nav-link ml-auto portfolioLink"
          href="https://www.natethedev.com/"
          target="_blank"
          rel="noopener">Created by Nate Mallison</a>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'getIsAuth',
      'getUserName'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ])
  }
}
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
.portfolioLink {
  font-size: 1.1rem;
  font-weight: bold;
  font-style: italic;
  color: black !important;
}

.active {
  font-weight: bold;
}
</style>
