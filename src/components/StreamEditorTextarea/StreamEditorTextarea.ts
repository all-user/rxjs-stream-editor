import { useStore } from '../../store';
import { StreamDataset } from '../../core/StreamDataset';
import { computed, defineComponent } from 'vue';

const StreamEditorTextarea = defineComponent({
  props: {
    dataset: {
      type: StreamDataset,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const sourceCode = computed({
      get() {
        return props.dataset?.sourceCode || '';
      },
      set(value: string) {
        if (props.dataset == null) {
          return;
        }
        store.commit('domain/streamEditor/setSourceCode', {
          streamDatasetId: props.dataset.id,
          sourceCode: value,
        });
      },
    });

    return {
      sourceCode,
    };
  },
});

export default StreamEditorTextarea;
