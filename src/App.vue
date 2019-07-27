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
*
  position: relative
  box-sizing: border-box

body
  padding: 0
  margin: 0
  width: 100vw
  height: 100vh
  display: block
  background-color: ivory

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  width: 100%
  height: 100%
</style>
