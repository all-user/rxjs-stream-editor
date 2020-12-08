<template>
  <div id="app">
    <AppHeader class="AppHeader" />
    <StreamEditor class="StreamEditor" />
    <BottomNav />
  </div>
</template>

<script lang="ts">
import AppHeader from './components/AppHeader/AppHeader.vue';
import StreamEditor from './components/StreamEditor/StreamEditor.vue';
import BottomNav from './components/BottomNav/BottomNav.vue';
import { defineComponent } from 'vue';
import { StreamDataset } from './core/StreamDataset';
import { ColorDefinition } from './core/ColorDefinition';
import { useStore } from './store';

const App = defineComponent({
  components: {
    AppHeader,
    StreamEditor,
    BottomNav,
  },
  setup() {
    const store = useStore();

    const initializeStreamDatasets = () => {
      const streamDatasets: StreamDataset[] = [
        new StreamDataset({
          sourceCode: "fromEvent(document.defaultView, 'click')",
        }),
        new StreamDataset({
          sourceCode: '_0$.pipe(buffer(_0$.pipe(debounceTime(250))))',
        }),
        new StreamDataset({
          sourceCode: '_1$.pipe(map(ev => ev.length))',
        }),
        new StreamDataset({
          sourceCode: '_2$.pipe(filter(ev => ev === 2))',
        }),
      ];
      streamDatasets.forEach(streamDataset => {
        store.commit('domain/streamEditor/pushStreamDataset', {
          streamDataset,
        });
      });
    };

    const initializeColorDefinitions = () => {
      if (store.getters['domain/streamColorizer/colorDefinitions'].length) {
        return;
      }
      const blankDefinitions = new Array(9 * 9 - 4)
        .fill(void 0)
        .map(() => new ColorDefinition());
      const definitions = [
        new ColorDefinition({ colorCode: '#FC5137' }),
        new ColorDefinition({ colorCode: '#72D329' }),
        new ColorDefinition({ colorCode: '#FEC137' }),
        new ColorDefinition({ colorCode: '#348FBF' }),
      ].concat(blankDefinitions);
      store.commit('domain/streamColorizer/setColorDefinitions', definitions);
    };

    const initializeColorMatcherSourceCode = () => {
      if (store.state.domain.streamColorizer.colorMatcherSourceCode.length) {
        return;
      }
      store.commit(
        'domain/streamColorizer/setColorMatcherSourceCode',
        `
event => {
  switch (event) {
    case 2:
      return 'a1';
    default:
      return null;
  }
}
        `.trim(),
      );
    };

    initializeStreamDatasets();
    initializeColorDefinitions();
    initializeColorMatcherSourceCode();
  },
});

export default App;
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
