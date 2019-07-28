import { Component, Watch, Vue } from 'vue-property-decorator';
import streamItemModule from '../../store/modules/streamItem';
import StreamItem from '../../domain/StreamItem';
import StreamEditorItem from '../StreamEditorItem/StreamEditorItem.vue';
import debounce from 'lodash-es/debounce';

@Component({
  components: {
    StreamEditorItem,
  },
})
export default class StreamEditor extends Vue.extend({
  computed: {
    ...streamItemModule.mapGetters(['streamItems', 'sourceCode']),
    ...streamItemModule.mapState(['errorMessage']),
  },
  methods: {
    ...streamItemModule.mapActions(['evaluateSourceCode']),
  },
}) {
  @Watch('sourceCode')
  public watchSourceCode() {
    this.evaluateSourceCodeDebounced();
  }

  get streamItemCtx() {
    return streamItemModule.context(this.$store);
  }

  get evaluateSourceCodeDebounced() {
    return debounce(this.evaluateSourceCode, 500);
  }

  public handleAddStream() {
    this.streamItemCtx.mutations.pushStreamItem({
      streamItem: new StreamItem({
        sourceCode: `_${this.streamItems.length - 1}$`,
      }),
    });
  }

  public handleRemoveStream() {
    this.streamItemCtx.mutations.popStreamItem();
  }

  public created() {
    const streamItems: StreamItem[] = [
      new StreamItem({
        sourceCode: "fromEvent(document.body, 'click')",
      }),
      new StreamItem({
        sourceCode: '_0$.pipe(buffer(_0$.pipe(debounceTime(250))))',
      }),
      new StreamItem({
        sourceCode: '_1$.pipe(map(list => list.length))',
      }),
      new StreamItem({
        sourceCode: '_2$.pipe(filter(x => x === 2))',
      }),
    ];
    streamItems.forEach(streamItem => {
      this.streamItemCtx.mutations.pushStreamItem({ streamItem });
    });
  }

  public beforeMount() {
    this.evaluateSourceCode();
  }
}
