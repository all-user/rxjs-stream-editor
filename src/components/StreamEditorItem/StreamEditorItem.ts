import { Component, Prop, Vue } from 'vue-property-decorator';
import StreamItem from '../../domain/StreamItem';
import streamItem from '../../store/modules/streamItem';

@Component
export default class StreamEditorItem extends Vue {
  @Prop() public item!: StreamItem;

  get streamItemCtx() {
    return streamItem.context(this.$store);
  }

  get sourceCode() {
    return this.item.sourceCode;
  }

  set sourceCode(value: string) {
    this.streamItemCtx.mutations.setSourceCode({
      streamItemId: this.item.id,
      sourceCode: value,
    });
  }
}
