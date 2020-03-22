<template>
  <div id="app">
    <AppHeader class="AppHeader"/>
    <StreamEditor class="StreamEditor"/>
    <BottomNav/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppHeader from './components/AppHeader/AppHeader.vue';
import StreamEditor from './components/StreamEditor/StreamEditor.vue';
import BottomNav from './components/BottomNav/BottomNav.vue';
import { StreamDataset } from './core/StreamDataset';
import {
  domainStreamEditorModule,
  domainStreamColorizerModule,
} from './store/modules/internal';
import { ColorDefinition } from './core/ColorDefinition';

@Component({
  components: {
    AppHeader,
    StreamEditor,
    BottomNav,
  },
})
export default class App extends Vue.extend({
  computed: {
    ...domainStreamColorizerModule.mapState(['colorMatcherSourceCode']),
    ...domainStreamColorizerModule.mapGetters(['colorDefinitions']),
  },
  methods: {
    ...domainStreamEditorModule.mapMutations(['pushStreamDataset']),
    ...domainStreamColorizerModule.mapMutations([
      'setColorMatcherSourceCode',
      'setColorDefinitions',
    ]),
  },
}) {
  public initializeStreamDatasets() {
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
      this.pushStreamDataset({ streamDataset });
    });
  }

  public initializeColorDefinitions() {
    if (this.colorDefinitions.length) {
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
    this.setColorDefinitions(definitions);
  }

  public initializeColorMatcherSourceCode() {
    if (this.colorMatcherSourceCode.length) {
      return;
    }
    this.setColorMatcherSourceCode(
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
  }

  public created() {
    this.initializeStreamDatasets();
    this.initializeColorDefinitions();
    this.initializeColorMatcherSourceCode();
  }
}
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
