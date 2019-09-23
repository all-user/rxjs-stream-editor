<template>
  <div id="app">
    <AppHeader class="AppHeader"/>
    <StreamEditor class="StreamEditor"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppHeader from './components/AppHeader/AppHeader.vue';
import StreamEditor from './components/StreamEditor/StreamEditor.vue';

@Component({
  components: {
    AppHeader,
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
  min-height: 100vh
  display: flex
  flex-flow: column nowrap

.AppHeader
  flex: 0 0 auto
  position: sticky
  top: 0
  z-index: 2
  margin: 0
  border-bottom: 1px solid black
  width: 100%

.StreamEditor
  flex: 1 1 auto
  width: 100%
</style>
