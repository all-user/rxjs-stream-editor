import { Component, Prop, Vue } from 'vue-property-decorator';
import { StreamEvent, StreamDataset } from '../../domain/internal';
import { streamEditorModule } from '../../store/modules/domain/internal';
import StreamEditorTextarea from '../StreamEditorTextarea/StreamEditorTextarea.vue';

@Component({
  components: {
    StreamEditorTextarea,
  },
})
export default class StreamEditorItem extends Vue.extend({
  methods: {
    ...streamEditorModule.mapMutations(['shiftEvent']),
  },
}) {
  @Prop() public dataset: StreamDataset | undefined;
  @Prop({ required: true }) public index!: boolean;
  @Prop({ default: false }) public disabled!: boolean;

  get events() {
    return this.dataset ? this.dataset.events : [];
  }

  public isNumberEvent(event: StreamEvent) {
    return event.value.__proto__ === Number.prototype;
  }

  public isStringEvent(event: StreamEvent) {
    return event.value.__proto__ === String.prototype;
  }

  public isArrayEvent(event: StreamEvent) {
    return Array.isArray(event.value);
  }

  public handleEventAnimationEnd(streamDataset: StreamDataset) {
    this.shiftEvent({
      streamDatasetId: streamDataset.id,
    });
  }
}
