<template>
  <div>
    <nav class="navbar navbar-inverse">
      <div class="container-fluid">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/home"
            >Stock Trader</router-link
          >
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li>
              <router-link to="/portfolio"
                >Portfolio <span class="sr-only">(current)</span></router-link
              >
            </li>
            <li>
              <router-link class="active" to="/stocks">Stocks</router-link>
            </li>
          </ul>
          <strong class="navbar-text">Funds : {{funds | currency}}</strong>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#" @click="endDay">End Day</a></li>
            <li class="dropdown " :class="{open: isDropDownOpen}" @click="isDropDownOpen= !isDropDownOpen">
              <a
                href="#"
                class="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                >{{user}}<span class="caret"></span
              ></a>
              <ul class="dropdown-menu">
                <li><a href="#" @click.prevent="logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      isDropDownOpen: false
    }
  },
  computed: {
    funds () {
      return this.$store.getters.funds
    },
    user () {
      return this.$store.getters.store.userName
    }
  },
  methods: {
    ...mapActions([
      'rendomizeStocks'
    ]),
    logout () {
      this.$store.dispatch('logOut')
    },
    endDay () {
      this.rendomizeStocks()
    }
  }
}
</script>
