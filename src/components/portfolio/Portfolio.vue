<template>
    <div>
       <div class=".container-fluid position" v-if = "!stocks.length">
         <h3><span class="label label-info">Haven't Purchased any stock(s) yet !</span></h3>
       </div>
       <app-stock v-else v-for="stock in stocks" :stock="stock" :key=stock></app-stock>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Stock from './Stock.vue'
export default {
  computed: {
    ...mapGetters({
      stocks: 'stockPortfolio'
    })
  },
  components: {
    appStock: Stock
  }
}
</script>

<style scoped>
.position {
  padding :200px;
  text-align: center;
}
</style>
