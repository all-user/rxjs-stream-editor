<template>
  <div id="app">
    <StreamEditor/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StreamEditor from './components/StreamEditor/StreamEditor.vue';

@Component({
  components: {
    StreamEditor,
  },
})
export default class App extends Vue {}
</script>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px

body
  padding 20px 0
  margin 0
  width 100vw
  height 100vh
  display block
  background-color ivory
</style>
