import { Component, Prop, Vue } from 'vue-property-decorator';
import StreamItem from '../../domain/StreamItem';
import { streamItemModule } from '../../store/modules';

@Component
export default class StreamEditorTextarea extends Vue {
  @Prop() public item: StreamItem | undefined;
  @Prop({ default: false }) public disabled!: boolean;

  get streamItemCtx() {
    return streamItemModule.context(this.$store);
  }

  get sourceCode() {
    return this.item ? this.item.sourceCode : '';
  }

  set sourceCode(value: string) {
    if (this.item == null) {
      return;
    }
    this.streamItemCtx.mutations.setSourceCode({
      streamItemId: this.item.id,
      sourceCode: value,
    });
  }
}
