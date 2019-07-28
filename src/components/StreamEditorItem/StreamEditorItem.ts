import { Component, Prop, Vue } from 'vue-property-decorator';
import StreamItem from '../../domain/StreamItem';
import Packet from '../../domain/Packet';
import streamItemModule from '../../store/modules/streamItem';
import StreamEditorTextarea from '../StreamEditorTextarea/StreamEditorTextarea.vue';

@Component({
  components: {
    StreamEditorTextarea,
  },
})
export default class StreamEditorItem extends Vue {
  @Prop() public item: StreamItem | undefined;
  @Prop({ required: true }) public index!: boolean;
  @Prop({ default: false }) public disabled!: boolean;

  get streamItemCtx() {
    return streamItemModule.context(this.$store);
  }

  get packets() {
    return this.item ? this.item.packets : [];
  }

  public isNumberPacket(packet: Packet) {
    return typeof packet.value === 'number';
  }

  public isArrayPacket(packet: Packet) {
    return Array.isArray(packet.value);
  }

  public handlePakcetAnimationEnd(streamItem: StreamItem) {
    this.streamItemCtx.mutations.shiftPacket({
      streamItemId: streamItem.id,
    });
  }
}
