import { Component, Watch, Vue } from 'vue-property-decorator';
import { streamEditorModule } from '../../store/modules/domain/internal';
import { StreamDataset } from '../../domain/internal';
import StreamEditorItem from '../StreamEditorItem/StreamEditorItem.vue';
import debounce from 'lodash-es/debounce';

@Component({
  components: {
    StreamEditorItem,
  },
})
export default class StreamEditor extends Vue.extend({
  computed: {
    ...streamEditorModule.mapGetters(['streamDatasets', 'sourceCode']),
    ...streamEditorModule.mapState(['errorMessage', 'message']),
  },
  methods: {
    ...streamEditorModule.mapActions(['evaluateSourceCode']),
    ...streamEditorModule.mapMutations([
      'pushStreamDataset',
      'popStreamDataset',
    ]),
  },
}) {
  @Watch('sourceCode')
  public watchSourceCode() {
    this.evaluateSourceCodeDebounced();
  }

  get evaluateSourceCodeDebounced() {
    return debounce(this.evaluateSourceCode, 500);
  }

  public handleAddStream() {
    this.pushStreamDataset({
      streamDataset: new StreamDataset({
        sourceCode: `_${this.streamDatasets.length - 1}$`,
      }),
    });
  }

  public handleRemoveStream() {
    this.popStreamDataset();
  }

  public created() {
    const streamDatasets: StreamDataset[] = [
      new StreamDataset({
        sourceCode: "fromEvent(document.body, 'click')",
      }),
      new StreamDataset({
        sourceCode: '_0$.pipe(buffer(_0$.pipe(debounceTime(250))))',
      }),
      new StreamDataset({
        sourceCode: '_1$.pipe(map(list => list.length))',
      }),
      new StreamDataset({
        sourceCode: '_2$.pipe(filter(x => x === 2))',
      }),
    ];
    streamDatasets.forEach(streamDataset => {
      this.pushStreamDataset({ streamDataset });
    });
  }

  public beforeMount() {
    this.evaluateSourceCode();
  }
}
