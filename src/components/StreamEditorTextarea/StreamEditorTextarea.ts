import { Component, Prop, Vue } from 'vue-property-decorator';
import { StreamDataset } from '../../core/StreamDataset';
import { domainStreamEditorModule } from '../../store/modules/internal';

@Component
export default class StreamEditorTextarea extends Vue.extend({
  methods: {
    ...domainStreamEditorModule.mapMutations(['setSourceCode']),
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
