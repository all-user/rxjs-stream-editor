import { Component, Watch, Vue } from 'vue-property-decorator';
import { domainStreamEditorModule } from '../../store/modules/internal';
import { StreamDataset } from '../../core/StreamDataset';
import StreamEditorItem from '../StreamEditorItem/StreamEditorItem.vue';
import debounce from 'lodash-es/debounce';

@Component({
  components: {
    StreamEditorItem,
  },
})
export default class StreamEditor extends Vue.extend({
  computed: {
    ...domainStreamEditorModule.mapGetters(['streamDatasets', 'sourceCode']),
  },
  methods: {
    ...domainStreamEditorModule.mapActions(['evaluateSourceCode']),
    ...domainStreamEditorModule.mapMutations([
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

  public beforeMount() {
    this.evaluateSourceCode();
  }
}
