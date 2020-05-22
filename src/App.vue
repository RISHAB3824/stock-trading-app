<template>
  <div class="container">
    <router-view name="Header-Top"></router-view>
    <!-- <router-view name="StockPage-Header"></router-view> -->
    <div class="row">
      <div class="col-xs-12">
        <transition name="slide" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('initStocks')
    this.$store.dispatch('tryAutoLogin')
  }
}
</script>
<style>
body {
  padding: 30px;
}
.slide-enter-active {
  animation: slide-in 500ms ease-out forwards;
}

.slide-leave-active {
  animation: slide-out 500ms ease-out forwards;
}

@keyframes slide-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-30px);
    opacity: 0;
  }
}
</style>
