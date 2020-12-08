import { computed, defineComponent } from 'vue';
import { StreamEvent } from '../../core/StreamEvent';
import { StreamDataset } from '../../core/StreamDataset';
import StreamEditorTextarea from '../StreamEditorTextarea/StreamEditorTextarea.vue';
import { useStore } from '../../store';

const createNoCircularJsonStringifyReplacer = () => {
  const seen: unknown[] = [];
  return (_: string, value: unknown) => {
    if (value != null && typeof value === 'object') {
      if (seen.indexOf(value) >= 0) {
        return;
      }
      seen.push(value);
    }
    return value;
  };
};

const StreamEditorItem = defineComponent({
  components: {
    StreamEditorTextarea,
  },
  props: {
    dataset: {
      type: StreamDataset,
      required: false,
    },
    index: {
      type: Number,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const events = computed(() => (props.dataset ? props.dataset.events : []));

    const getEventStyle = (
      event: StreamEvent,
    ): Partial<CSSStyleDeclaration> => {
      const backgroundColor =
        store.getters['domain/streamColorizer/colorCodeGetter'](
          store.getters['domain/streamColorizer/colorMatcher'](event.value) ??
            '',
        ) ?? '';
      return { backgroundColor };
    };

    const isNumberEvent = (event: StreamEvent) =>
      event.value != null && event.value.__proto__ === Number.prototype;
    const isStringEvent = (event: StreamEvent) =>
      event.value != null && event.value.__proto__ === String.prototype;
    const isBooleanEvent = (event: StreamEvent) =>
      event.value != null && event.value.__proto__ === Boolean.prototype;
    const isArrayEvent = (event: StreamEvent) => Array.isArray(event.value);
    const isNull = (event: StreamEvent) => event.value === null;
    const isUndefined = (event: StreamEvent) => event.value === undefined;

    const handleEventAnimationEnd = (streamDataset?: StreamDataset) => {
      if (!streamDataset) return;
      store.commit('domain/streamEditor/shiftEvent', {
        streamDatasetId: streamDataset.id,
      });
    };

    const handleEventClick = (event: StreamEvent) => {
      const jsonString = JSON.stringify(
        event.value,
        createNoCircularJsonStringifyReplacer(),
        2,
      );
      store.commit('domain/streamEditor/setMessage', { message: jsonString });
    };

    return {
      handleEventAnimationEnd,
      handleEventClick,
      isNumberEvent,
      isStringEvent,
      isBooleanEvent,
      isArrayEvent,
      isNull,
      isUndefined,
      getEventStyle,
      events,
    };
  },
});

export default StreamEditorItem;
