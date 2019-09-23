import { Component, Prop, Vue } from 'vue-property-decorator';
import { StreamDataset } from '../../domain/internal';
import { streamEditorModule } from '../../store/modules/domain/internal';

@Component
export default class StreamEditorTextarea extends Vue.extend({
  methods: {
    ...streamEditorModule.mapMutations(['setSourceCode']),
  },
}) {
  @Prop() public dataset: StreamDataset | undefined;
  @Prop({ default: false }) public disabled!: boolean;

  get sourceCode() {
    return this.dataset ? this.dataset.sourceCode : '';
  }

  set sourceCode(value: string) {
    if (this.dataset == null) {
      return;
    }
    this.setSourceCode({
      streamDatasetId: this.dataset.id,
      sourceCode: value,
    });
  }
}
