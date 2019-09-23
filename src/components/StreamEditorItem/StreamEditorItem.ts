import { Component, Prop, Vue } from 'vue-property-decorator';
import { StreamEvent, StreamDataset } from '../../domain/internal';
import { streamEditorModule } from '../../store/modules/domain/internal';
import StreamEditorTextarea from '../StreamEditorTextarea/StreamEditorTextarea.vue';

const createNoCircularJsonStringifyReplacer = () => {
  const seen: any[] = [];
  return (_: string, value: any) => {
    if (value != null && typeof value === 'object') {
      if (seen.indexOf(value) >= 0) {
        return;
      }
      seen.push(value);
    }
    return value;
  };
};

@Component({
  components: {
    StreamEditorTextarea,
  },
})
export default class StreamEditorItem extends Vue.extend({
  methods: {
    ...streamEditorModule.mapMutations(['shiftEvent', 'setMessage']),
  },
}) {
  @Prop() public dataset: StreamDataset | undefined;
  @Prop({ required: true }) public index!: boolean;
  @Prop({ default: false }) public disabled!: boolean;

  get events() {
    return this.dataset ? this.dataset.events : [];
  }

  public isNumberEvent(event: StreamEvent) {
    return event.value != null && event.value.__proto__ === Number.prototype;
  }

  public isStringEvent(event: StreamEvent) {
    return event.value != null && event.value.__proto__ === String.prototype;
  }

  public isArrayEvent(event: StreamEvent) {
    return Array.isArray(event.value);
  }

  public isNull(event: StreamEvent) {
    return event.value === null;
  }

  public isUndefined(event: StreamEvent) {
    return event.value === undefined;
  }

  public handleEventAnimationEnd(streamDataset: StreamDataset) {
    this.shiftEvent({
      streamDatasetId: streamDataset.id,
    });
  }

  public handleEventClick(event: StreamEvent) {
    const jsonString = JSON.stringify(
      event.value,
      createNoCircularJsonStringifyReplacer(),
      2,
    );
    this.setMessage({ message: jsonString });
  }
}
